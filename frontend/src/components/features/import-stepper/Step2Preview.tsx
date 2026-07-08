"use client";

import { useState } from "react";
import { X, FileSpreadsheet, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useImportStore } from "@/store/import.store";

export const Step2Preview = () => {
  const { previewData, file, batchId, startProcessing, reset } = useImportStore();
  const [isStarting, setIsStarting] = useState(false);

  const handleConfirm = async () => {
    if (!batchId) return;
    setIsStarting(true);
    try {
      await ApiClient.confirmImport(batchId);
      startProcessing();
    } catch (error) {
      toast.error("Failed to start AI processing.");
      setIsStarting(false);
    }
  };

  if (!previewData || previewData.length === 0) return null;

  const headers = Object.keys(previewData[0]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
    >
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Review CSV Data</h2>
          <p className="text-sm text-slate-500 mt-1">Check your data before starting the AI import process.</p>
        </div>
        <button onClick={reset} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* File Info */}
      <div className="px-6 pt-4 pb-2 shrink-0">
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{file?.name || "Uploaded File"}</p>
              <p className="text-xs text-slate-500">{file ? (file.size / 1024).toFixed(2) : "0"} KB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Data Area */}
      <div className="flex-1 px-6 py-4 overflow-hidden flex flex-col">
        <div className="flex-1 w-full overflow-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="py-3 px-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                  {headers.map((h, colIndex) => (
                    <td key={colIndex} className="py-3 px-2 truncate max-w-[150px]">
                      {row[h] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex gap-4 bg-white shrink-0">
        <button 
          onClick={reset} 
          disabled={isStarting} 
          className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleConfirm} 
          disabled={isStarting}
          className="flex-1 py-3 rounded-xl bg-brand-coral hover:bg-brand-coralHover text-white font-bold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isStarting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Starting AI Agent...
            </>
          ) : (
            "Confirm & Start AI Mapping"
          )}
        </button>
      </div>
    </motion.div>
  );
};