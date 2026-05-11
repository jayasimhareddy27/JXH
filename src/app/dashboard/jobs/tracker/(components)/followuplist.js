"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFollowUp, fetchFollowUps } from "@lib/redux/features/followup/thunks"; 
import { 
  Bell, Mail, Linkedin, Phone, MoreHorizontal, 
  Trash2, Loader2 
} from "lucide-react";

export default function FollowUpList({ followUps = [], isJobSpecific = false }) {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      // Remove the task permanently
      await dispatch(deleteFollowUp(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearFilter = () => {
    dispatch(fetchFollowUps()); // Global fetch
  };

  if (followUps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-60">
        <div className="p-4 bg-[var(--color-background-tertiary)] rounded-full">
          <Bell size={40} className="text-[var(--color-text-placeholder)]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black uppercase tracking-tighter text-[var(--color-text-primary)]">
            Pipeline Clear
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            No active follow-ups in this view.
          </p>
        </div>
        {isJobSpecific && (
          <button 
            onClick={handleClearFilter}
            className="mt-2 text-[10px] font-black text-blue-500 uppercase border-b border-blue-500/30 hover:border-blue-500 transition-all"
          >
            View Global Tasks
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-500" size={16} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-placeholder)]">
            {isJobSpecific ? "Active Job Tasks" : "Global Pipeline"}
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 text-[10px] font-black italic">
          {followUps.length} Tasks
        </span>
      </header>

      <div className="space-y-3">
        {followUps.map((f) => (
          <div 
            key={f._id} 
            className="group relative p-4 border border-[var(--color-border-secondary)] rounded-2xl bg-[var(--color-background-secondary)] hover:border-blue-500/30 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <TypeIcon type={f.type || 'email'} />
                  <span className="text-[10px] font-black uppercase text-[var(--color-text-placeholder)] tracking-widest">
                    {f.type || 'General'}
                  </span>
                </div>
                
                <h3 className="text-xs font-black text-[var(--color-text-primary)] truncate uppercase tracking-tight">
                  {f.position}
                </h3>
                <p className="text-[10px] font-bold text-[var(--color-text-secondary)] truncate">
                  {f.companyName}
                </p>
                
                <div className="mt-3 flex items-center gap-2 text-[10px] font-black italic text-blue-600">
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  Due: {new Date(f.followUpDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <button
                onClick={() => handleDelete(f._id)}
                disabled={deletingId === f._id}
                className="flex-shrink-0 p-2.5 rounded-xl bg-[var(--color-background-tertiary)] text-[var(--color-text-secondary)] hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                title="Remove from Pipeline"
              >
                {deletingId === f._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
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
  const iconProps = { size: 12 };
  switch (type?.toLowerCase()) {
    case 'email': return <Mail {...iconProps} className="text-blue-500" />;
    case 'linkedin': return <Linkedin {...iconProps} className="text-blue-700" />;
    case 'phone': return <Phone {...iconProps} className="text-emerald-500" />;
    default: return <MoreHorizontal {...iconProps} className="text-blue-500" />;
  }
}