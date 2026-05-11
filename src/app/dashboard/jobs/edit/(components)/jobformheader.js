import { ArrowLeft, Save, Loader2, Zap } from "lucide-react";
import Link from "next/link";

export default function JobFormHeader({ isExtracting, onExtract, loading }) {
  return (
    <div className="flex justify-between items-center mb-8 p-6 shadow-modal bg-[var(--color-background-secondary)] rounded-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/jobs/tracker" className="p-3 hover:bg-[var(--color-background-tertiary)] rounded-full transition-all text-[var(--color-text-secondary)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-black uppercase tracking-tight">Job Intelligence Intake</h1>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onExtract} disabled={isExtracting} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
          {isExtracting ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
          {isExtracting ? "Analyzing..." : "Run AI Intelligence"}
        </button>
        <button form="job-form" type="submit" disabled={loading} className="btn-primary bg-[var(--color-cta-bg)] flex items-center gap-2 text-sm">
          <Save size={16} /> Finalize Entry
        </button>
      </div>
    </div>
  );
}