"use client";

import { Target, CheckCircle2, AlertCircle } from "lucide-react";

export default function AtsTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[var(--color-button-secondary-bg)] rounded-3xl p-8 text-center border border-[var(--color-button-primary-bg)]/20">
        <div className="text-4xl font-black text-[var(--color-button-primary-bg)] mb-1">84%</div>
        <div className="text-[10px] font-bold text-[var(--color-button-primary-bg)] uppercase tracking-widest">ATS Score</div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
          <div>
            <div className="text-xs font-bold text-emerald-900">Standard Sections Detected</div>
            <div className="text-[10px] text-emerald-700">Experience, Education, and Skills are correctly formatted.</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <AlertCircle className="text-amber-500 shrink-0" size={18} />
          <div>
            <div className="text-xs font-bold text-amber-900">Add More Keywords</div>
            <div className="text-[10px] text-amber-700">Try adding "Next.js" or "Redux" to match current job descriptions.</div>
          </div>
        </div>
      </div>
    </div>
  );
}