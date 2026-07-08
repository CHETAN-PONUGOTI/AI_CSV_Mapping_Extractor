export type CrmStatus = 'GOOD_LEAD_FOLLOW_UP' | 'DID_NOT_CONNECT' | 'BAD_LEAD' | 'SALE_DONE';
export type DataSource = 'leads_on_demand' | 'meridian_tower' | 'eden_park' | 'varah_swamy' | 'sarjapur_plots';

export interface CrmLead {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: CrmStatus;
  crm_note?: string;
  data_source?: DataSource;
  possession_time?: string;
  description?: string;
}

export type RawCsvRow = Record<string, string>;

export interface UploadPreviewResponse {
  batchId: string;
  totalRows: number;
  previewRows: RawCsvRow[];
}

export interface BatchStatus {
  id: string;
  status: 'PENDING_CONFIRMATION' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRows: number;
  processedRows: number;
  skippedRows: number;
}

export interface LeadRecordResult {
  id: string;
  status: 'SUCCESS' | 'SKIPPED' | 'FAILED';
  errorMessage: string | null;
  originalData: RawCsvRow;
  parsedData: CrmLead | null;
}