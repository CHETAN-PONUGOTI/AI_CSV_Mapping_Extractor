"use client";

import { useState, useRef } from "react";
import { Upload, FileDown, X, Loader2, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useImportStore } from "@/store/import.store";

export const Step1Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Bring in our global state updater
  const setFileAndPreview = useImportStore((state) => state.setFileAndPreview);
  const reset = useImportStore((state) => state.reset);

  const handleFileSelect = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Invalid file type. Please upload a CSV file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      // If they click upload without a file, trigger the file browser
      fileInputRef.current?.click();
      return;
    }

    setIsUploading(true);
    try {
      // 1. Send file to the Express backend
      const data = await ApiClient.uploadCsv(selectedFile);
      // 2. Update Zustand store (this automatically moves us to Step 2)
      setFileAndPreview(selectedFile, data.batchId, data.previewRows, data.totalRows);
      toast.success("File parsed successfully!");
    } catch (error) {
      toast.error("Failed to upload and parse the CSV.");
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Import Leads via CSV</h2>
          <p className="text-sm text-slate-500 mt-1">Upload a CSV file to bulk import leads into your system.</p>
        </div>
        <button onClick={reset} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Body / Dropzone */}
      <div className="p-6">
        <div 
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            isDragging ? "border-brand-coral bg-orange-50" : "border-slate-200 hover:border-slate-300"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
        >
          {selectedFile ? (
            // Show selected file state
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 border border-teal-100">
                <FileSpreadsheet size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedFile.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-lg"
              >
                Remove File
              </button>
            </div>
          ) : (
            // Show default drag & drop state
            <>
              <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center mb-5 text-teal-700">
                <Upload strokeWidth={1.5} size={28} />
              </div>
              
              <h3 className="text-lg font-bold text-slate-900">Drop your CSV file here</h3>
              <p className="text-sm text-slate-500 mb-6">or click to browse files</p>
              
              <div className="bg-slate-50 border border-slate-100 text-slate-600 text-xs px-4 py-2 rounded-full mb-6 flex items-center gap-2 pointer-events-none">
                <span className="w-3 h-3 rounded-full border border-slate-300 flex items-center justify-center text-[8px]">i</span>
                Supported file: .csv (max 5MB)
              </div>

              <p className="text-xs text-center text-slate-400 max-w-md leading-relaxed mb-6 pointer-events-none">
                Required headers: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note.
              </p>

              <button 
                onClick={(e) => { e.stopPropagation(); toast.info("Downloading template..."); }}
                className="flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-6 py-2.5 rounded-lg transition-colors"
              >
                <FileDown size={16} />
                Download Sample CSV Template
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex gap-4">
        <button onClick={reset} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button 
          onClick={handleUploadClick} 
          disabled={isUploading}
          className="flex-1 py-3 rounded-xl bg-brand-coral hover:bg-brand-coralHover text-white font-bold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Parsing Data...
            </>
          ) : (
             selectedFile ? "Upload File" : "Select File"
          )}
        </button>
      </div>
    </motion.div>
  );
};