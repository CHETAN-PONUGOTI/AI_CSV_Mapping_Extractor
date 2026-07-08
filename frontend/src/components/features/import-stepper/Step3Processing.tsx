"use client";

import { useEffect } from "react";
import { useImportStore } from "@/store/import.store";
import { ApiClient } from "@/lib/api-client";
import { Bot, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const Step3Processing = () => {
  const { batchId, batchStatus, updateStatus, setResults } = useImportStore();

  useEffect(() => {
    if (!batchId) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await ApiClient.getBatchStatus(batchId);
        updateStatus(status);

        if (status.status === 'COMPLETED' || status.status === 'FAILED') {
          clearInterval(pollInterval);
          if (status.status === 'COMPLETED') {
            const resultData = await ApiClient.getBatchResults(batchId);
            setResults(resultData.records);
          }
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [batchId, updateStatus, setResults]);

  const progress = batchStatus?.totalRows 
    ? Math.round(((batchStatus.processedRows + batchStatus.skippedRows) / batchStatus.totalRows) * 100) 
    : 0;

  return (
    <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden p-10 flex flex-col items-center text-center border border-slate-100">
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center absolute -inset-2 animate-pulse"></div>
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center relative z-10 shadow-sm">
          <Bot size={32} />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2">AI is analyzing your data</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        Our agent is mapping columns, formatting dates, and standardizing inputs into CRM records.
      </p>

      <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
        <motion.div 
          className="bg-brand-coral h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        />
      </div>
      
      <div className="flex items-center justify-between w-full text-sm font-semibold text-slate-600 mb-6">
        <span>{progress}% Complete</span>
        <span>{batchStatus?.processedRows || 0} / {batchStatus?.totalRows || 0} rows</span>
      </div>

      <div className="flex flex-col gap-3 w-full text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <CheckCircle2 size={16} className="text-teal-500" /> Connecting to Gemini 2.5 Pro
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <CheckCircle2 size={16} className="text-teal-500" /> Validating CSV structure
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600 animate-pulse">
          <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-teal-500 animate-spin" /> Extracting insights & mapping fields...
        </div>
      </div>
    </div>
  );
};