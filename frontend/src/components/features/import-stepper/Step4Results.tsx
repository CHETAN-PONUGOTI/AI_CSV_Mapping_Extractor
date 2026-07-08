"use client";

import { useImportStore } from "@/store/import.store";
import { Download, CheckCircle2, AlertCircle } from "lucide-react";

export const Step4Results = () => {
  const { results, batchStatus } = useImportStore();

  const handleDownloadJson = () => {
    // Filter only successful records for the download
    const cleanData = results
      .filter(r => r.status === 'SUCCESS' && r.parsedData)
      .map(r => r.parsedData);

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "groweasy_extracted_leads.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const skippedCount = results.filter(r => r.status === 'SKIPPED').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header Area */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" />
            Import Completed
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Successfully parsed <span className="font-bold text-slate-800">{successCount}</span> records. 
            Skipped <span className="font-bold text-slate-800">{skippedCount}</span> invalid rows.
          </p>
        </div>
        
        <button 
          onClick={handleDownloadJson}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-coral hover:bg-brand-coralHover text-white rounded-xl font-semibold transition-colors shadow-sm"
        >
          <Download size={18} />
          Download JSON Data
        </button>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 rounded-tl-lg">Status</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">Name</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">Email</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">Phone</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 rounded-tr-lg">CRM Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {results.map((record, i) => (
              <tr key={record.id || i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4">
                  {record.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 size={12} /> Valid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      <AlertCircle size={12} /> Skipped
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 font-medium text-slate-900">
                  {record.parsedData?.name || '-'}
                </td>
                <td className="py-4 px-4">{record.parsedData?.email || '-'}</td>
                <td className="py-4 px-4">
                  {record.parsedData?.country_code ? `+${record.parsedData.country_code} ` : ''}
                  {record.parsedData?.mobile_without_country_code || '-'}
                </td>
                <td className="py-4 px-4">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium">
                    {record.parsedData?.crm_status?.replace(/_/g, ' ') || 'UNMAPPED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {results.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No records to display.
          </div>
        )}
      </div>
    </div>
  );
};