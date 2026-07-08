import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/infrastructure/database/prisma.client';
import { StatusCodes } from 'http-status-codes';

describe('API: /api/v1/import', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /upload', () => {
    it('should reject requests without a file', async () => {
      const response = await request(app).post('/api/v1/import/upload');
      
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('error', 'No file provided');
    });

    it('should accept a valid CSV file and return a preview', async () => {
      const mockBatchId = 'test-batch-123';
      
      // Mock the Prisma DB creation response
      vi.mocked(prisma.importBatch.create).mockResolvedValue({
        id: mockBatchId,
        fileName: 'test.csv',
        totalRows: 1,
        processedRows: 0,
        skippedRows: 0,
        status: 'PENDING_CONFIRMATION',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const csvContent = 'name,email\nRahul,rahul@test.com';

      const response = await request(app)
        .post('/api/v1/import/upload')
        .attach('file', Buffer.from(csvContent), 'test.csv');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('batchId', mockBatchId);
      expect(response.body.totalRows).toBe(1);
      expect(response.body.previewRows).toHaveLength(1);
    });
  });

  describe('POST /:id/confirm', () => {
    it('should reject confirmation for an invalid or missing batch', async () => {
      vi.mocked(prisma.importBatch.findUnique).mockResolvedValue(null);

      const response = await request(app).post('/api/v1/import/invalid-id/confirm');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('error', 'Invalid batch or already processed');
    });

    it('should accept confirmation for a valid pending batch', async () => {
      const mockBatchId = 'valid-batch';
      
      vi.mocked(prisma.importBatch.findUnique).mockResolvedValue({
        id: mockBatchId,
        fileName: 'test.csv',
        totalRows: 1,
        processedRows: 0,
        skippedRows: 0,
        status: 'PENDING_CONFIRMATION',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app).post(`/api/v1/import/${mockBatchId}/confirm`);

      expect(response.status).toBe(StatusCodes.ACCEPTED);
      expect(response.body).toHaveProperty('message', 'AI Extraction started');
      expect(response.body).toHaveProperty('batchId', mockBatchId);
    });
  });
});