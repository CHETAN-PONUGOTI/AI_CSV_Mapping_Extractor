import { UploadPreviewResponse, BatchStatus, LeadRecordResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export class ApiClient {
  static async uploadCsv(file: File): Promise<UploadPreviewResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/import/upload`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  }

  static async confirmImport(batchId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/import/${batchId}/confirm`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to confirm import');
  }

  static async getBatchStatus(batchId: string): Promise<BatchStatus> {
    const response = await fetch(`${API_BASE_URL}/import/${batchId}/status`, {
      headers: {
        // This forces the browser to bypass its internal cache
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  }

  static async getBatchResults(batchId: string): Promise<{ records: LeadRecordResult[] }> {
    const response = await fetch(`${API_BASE_URL}/import/${batchId}/results`);
    if (!response.ok) throw new Error('Failed to fetch results');
    return response.json();
  }
}