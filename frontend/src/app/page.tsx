"use client";

import { useImportStore } from "@/store/import.store";
import { Step1Upload } from "@/components/features/import-stepper/Step1Upload";
import { Step2Preview } from "@/components/features/import-stepper/Step2Preview";
import { Step3Processing } from "@/components/features/import-stepper/Step3Processing";
import { Step4Results } from "@/components/features/import-stepper/Step4Results";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud } from "lucide-react";

export default function DashboardPage() {
  const { currentStep, reset } = useImportStore();

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead Importer</h1>
          <p className="text-sm text-slate-500 mt-1">Upload and map your CSV data seamlessly.</p>
        </div>
        {currentStep === 'RESULTS' && (
          <button 
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <UploadCloud size={16} /> Import Another File
          </button>
        )}
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {currentStep === 'UPLOAD' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute inset-0 flex items-center justify-center">
              <Step1Upload />
            </motion.div>
          )}
          {currentStep === 'PREVIEW' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute inset-0 flex items-center justify-center">
              <Step2Preview />
            </motion.div>
          )}
          {currentStep === 'PROCESSING' && (
            <motion.div key="process" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute inset-0 flex items-center justify-center">
              <Step3Processing />
            </motion.div>
          )}
          {currentStep === 'RESULTS' && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
              <Step4Results />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}