import { Zap, Building, Sparkles } from "lucide-react";

export default function IntelligenceHub({ job }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Must-Have Skills */}
      <div className="bg-[var(--color-background-secondary)] p-6 rounded-[2rem] border border-[var(--color-border-secondary)]">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-4">
          <Zap size={14} /> Must-Have Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {job.skills?.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[11px] font-black uppercase">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Business Context */}
      <div className="bg-[var(--color-background-secondary)] p-6 rounded-[2rem] border border-[var(--color-border-secondary)]">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2 mb-4">
          <Building size={14} /> Business Strategy
        </h3>
        <p className="text-xs font-bold text-[var(--color-text-primary)] leading-relaxed italic">
          {job.businessModel || "No strategy data available."}
        </p>
      </div>

      {/* Culture/Insights (Full Width) */}
      <div className="md:col-span-2 bg-[var(--color-background-secondary)] p-6 rounded-[2.5rem] border border-[var(--color-border-secondary)] border-l-4 border-l-emerald-500">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 mb-2">
          <Sparkles size={14} /> Culture & Growth Insights
        </h3>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] leading-relaxed">
          {job.companyInsights || "The AI didn't find specific culture fluff for this role."}
        </p>
      </div>
    </div>
  );
}