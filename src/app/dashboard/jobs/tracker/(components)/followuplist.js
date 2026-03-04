"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
// import { updateFollowUp } from "@lib/redux/features/followup/thunks"; // Assuming this exists
import { Bell, Mail, Linkedin, Phone, MoreHorizontal, CheckCircle2, Loader2 } from "lucide-react";

export default function FollowUpList({ followUps = [] }) {
  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);

  const handleComplete = async (id) => {
    setUpdatingId(id);
    // await dispatch(updateFollowUp({ id, updates: { status: 'completed' } }));
    // Example logic to simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800)); 
    setUpdatingId(null);
  };

  if (followUps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-60">
        <Bell size={40} className="text-[var(--color-text-secondary)]" />
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          All caught up! <br /> No pending follow-ups.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bell className="text-amber-500" size={18} /> 
          Upcoming Tasks
        </h2>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
          {followUps.length} Pending
        </span>
      </header>

      <div className="space-y-4">
        {followUps.map((f) => (
          <div 
            key={f._id} 
            className="group relative p-4 border border-[var(--color-border-secondary)] rounded-2xl bg-[var(--color-card-bg)] hover:border-amber-200 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <TypeIcon type={f.type} />
                  <span className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider">
                    {f.type}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                  {f.position}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  {f.companyName}
                </p>
                
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Due: {new Date(f.followUpDateTime).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => handleComplete(f._id)}
                disabled={updatingId === f._id}
                className="flex-shrink-0 p-2 rounded-xl bg-[var(--color-button-secondary-bg)] text-[var(--color-text-secondary)] hover:bg-green-50 hover:text-green-600 transition-colors group-hover:scale-105"
                title="Mark as Completed"
              >
                {updatingId === f._id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function TypeIcon({ type }) {
  const iconProps = { size: 14, className: "text-amber-600" };
  switch (type) {
    case 'email': return <Mail {...iconProps} className="text-blue-500" />;
    case 'linkedin': return <Linkedin {...iconProps} className="text-blue-700" />;
    case 'phone': return <Phone {...iconProps} className="text-green-600" />;
    default: return <MoreHorizontal {...iconProps} />;
  }
}