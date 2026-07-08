import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ImportManager } from '../services/import.manager';
import { prisma } from '../infrastructure/database/prisma.client';

// 1. Manually define the record shape to completely bypass VS Code's Prisma cache
interface ILeadRecord {
  id: string;
  batchId: string;
  originalData: string;
  parsedData: string | null;
  status: string;
  errorMessage: string | null;
  createdAt: Date;
}

export class UploadController {
  static async uploadAndPreview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'No file provided' });
        return;
      }
      
      const previewData = await ImportManager.createPreviewBatch(req.file.buffer, req.file.originalname);
      res.status(StatusCodes.OK).json(previewData);
    } catch (error) {
      next(error);
    }
  }

  static async confirmAndProcess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      
      const batch = await prisma.importBatch.findUnique({ where: { id } });
      if (!batch || batch.status !== 'PENDING_CONFIRMATION') {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid batch or already processed' });
        return;
      }

      ImportManager.processConfirmedBatch(id).catch(console.error);

      res.status(StatusCodes.ACCEPTED).json({ message: 'AI Extraction started', batchId: id });
    } catch (error) {
      next(error);
    }
  }

  static async getBatchStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      
      const batch = await prisma.importBatch.findUnique({
        where: { id },
        select: { id: true, status: true, totalRows: true, processedRows: true, skippedRows: true }
      });
      
      if (!batch) {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Batch not found' });
        return;
      }
      
      res.status(StatusCodes.OK).json(batch);
    } catch (error) {
      next(error);
    }
  }

  static async getBatchResults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      
      // 2. Cast the raw database result directly to our custom interface array
      const rawRecords = await prisma.leadRecord.findMany({
        where: { batchId: id, status: { in: ['SUCCESS', 'SKIPPED'] } }
      }) as unknown as ILeadRecord[];
      
      // 3. Map over the strongly typed array (TypeScript now knows EXACTLY what 'r' is)
      const results = rawRecords.map((r) => ({
        id: r.id,
        status: r.status,
        errorMessage: r.errorMessage,
        originalData: JSON.parse(r.originalData),
        parsedData: r.parsedData ? JSON.parse(r.parsedData) : null
      }));

      res.status(StatusCodes.OK).json({ records: results });
    } catch (error) {
      next(error);
    }
  }
}