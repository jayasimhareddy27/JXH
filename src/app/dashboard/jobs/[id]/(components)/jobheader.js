import { Building2, CircleDollarSign } from "lucide-react";

export default function JobHeader({ job }) {


  return (
    <div className="w-full space-y-8 py-4">
      {/* TOP ROW: STATUS & TYPE */}
      <div className="flex items-center gap-4">
        {job.jobType && (
          <div className="px-4 py-1 border border-[var(--color-border-secondary)] rounded-full bg-[var(--color-background-tertiary)]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
              {job.jobType}
            </span>
          </div>
        )}
      </div>

      {/* MAIN IDENTITY: MASSIVE TYPOGRAPHY */}
      <div className="space-y-2">
        <h1 className="text-5xl md:text-8xl font-black text-[var(--color-text-primary)] tracking-tighter leading-[0.8] uppercase italic">
          {job.position}
        </h1>
        
        <div className="flex flex-wrap items-end gap-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Building2 size={20} />
            </div>
            <span className="text-2xl md:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              {job.companyName}
            </span>
          </div>

          {job.salary && (
            <div className="flex items-center gap-2 pb-1 text-[var(--color-text-secondary)]">
              <CircleDollarSign size={18} className="text-emerald-500" />
              <span className="text-lg font-bold tracking-tight">{job.salary}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}