import { z } from 'zod';
import { CrmLeadSchema } from './crm.schema';

export type CrmLead = z.infer<typeof CrmLeadSchema>;
export type RawCsvRow = Record<string, string>;

export interface UploadPreviewResponse {
  batchId: string;
  totalRows: number;
  previewRows: RawCsvRow[];
}