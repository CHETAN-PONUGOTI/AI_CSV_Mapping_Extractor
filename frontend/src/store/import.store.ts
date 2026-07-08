import { create } from 'zustand';
import { RawCsvRow, BatchStatus, LeadRecordResult } from '@/types';

type ImportStep = 'UPLOAD' | 'PREVIEW' | 'PROCESSING' | 'RESULTS';

interface ImportState {
  currentStep: ImportStep;
  file: File | null;
  batchId: string | null;
  previewData: RawCsvRow[];
  totalRows: number;
  batchStatus: BatchStatus | null;
  results: LeadRecordResult[];
  
  setFileAndPreview: (file: File, batchId: string, previewData: RawCsvRow[], totalRows: number) => void;
  startProcessing: () => void;
  updateStatus: (status: BatchStatus) => void;
  setResults: (results: LeadRecordResult[]) => void;
  reset: () => void;
}

export const useImportStore = create<ImportState>((set) => ({
  currentStep: 'UPLOAD',
  file: null,
  batchId: null,
  previewData: [],
  totalRows: 0,
  batchStatus: null,
  results: [],

  setFileAndPreview: (file, batchId, previewData, totalRows) => 
    set({ file, batchId, previewData, totalRows, currentStep: 'PREVIEW' }),
    
  startProcessing: () => 
    set({ currentStep: 'PROCESSING' }),
    
  updateStatus: (batchStatus) => 
    set({ batchStatus }),
    
  setResults: (results) => 
    set({ results, currentStep: 'RESULTS' }),
    
  reset: () => 
    set({
      currentStep: 'UPLOAD',
      file: null,
      batchId: null,
      previewData: [],
      totalRows: 0,
      batchStatus: null,
      results: []
    })
}));