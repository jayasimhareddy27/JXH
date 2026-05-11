import { Zap, Calendar, Briefcase } from "lucide-react";
import { FLOW_STAGES } from "../(components)/constants"; // Adjust path as needed

export default function StatGrid({ job }) {
  // Find the icon and label for the current stage
  const currentStageInfo = FLOW_STAGES.find(s => s.key === job.stage) || FLOW_STAGES[1]; // default to 'saved'
  const StageIcon = currentStageInfo.icon;

  const stats = [
    { 
      icon: <Zap size={18}/>, 
      title: "Seniority", 
      value: job.seniorityLevel || "Mid-Level" 
    },
    { 
      icon: <Calendar size={18}/>, 
      title: "Date Posted", 
      value: job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "Recent" 
    },
    { 
      icon: <Briefcase size={18}/>, 
      title: "Profession", 
      value: "Engineering" 
    },
    { 
      icon: <StageIcon size={18} />, 
      title: "Pipeline Stage", 
      value: currentStageInfo.label 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-[var(--color-background-secondary)] p-6 rounded-[2rem] border border-[var(--color-border-secondary)] shadow-sm transition-all group">
          <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform inline-block">
            {s.icon}
          </div>
          <p className="text-[10px] font-black text-[var(--color-text-placeholder)] uppercase tracking-widest mb-1">
            {s.title}
          </p>
          <p className="text-sm font-black text-[var(--color-text-primary)] truncate uppercase" title={s.value}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}