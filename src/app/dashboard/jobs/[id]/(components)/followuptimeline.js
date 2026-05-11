"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {   createFollowUp,   updateFollowUp,   deleteFollowUp } from "@lib/redux/features/followup/thunks";
import { Clock, BellPlus, Loader2, X, Check, Edit2, Save } from "lucide-react";

export default function FollowUpTimeline({ jobId, companyName, position }) {
  const dispatch = useDispatch();
  const [customMsg, setCustomMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editId, setEditId] = useState(null);
  const [editMsg, setEditMsg] = useState("");

  const { followUps = [] } = useSelector((state) => state.followupstore || { followUps: [] });

  const handleAddFollowUp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const finalMessage = customMsg.trim() !== "" ? customMsg : `Follow up with ${companyName} regarding my application for ${position}.`;

    await dispatch(createFollowUp({
      jobId,
      companyName,
      position,
      message: finalMessage,
      followUpDateTime: nextWeek.toISOString(),
      status: 'pending'
    }));
    
    setCustomMsg("");
    setIsSubmitting(false);
  };

  const handleSaveEdit = async (fId) => {
    await dispatch(updateFollowUp({ id: fId, updates: { message: editMsg } }));
    setEditId(null);
  };

  return (
    <section className="bg-[var(--color-background-secondary)] rounded-[2.5rem] p-8 border border-[var(--color-border-secondary)] shadow-sm h-fit sticky top-8">
      <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-6 tracking-tighter flex items-center gap-2 uppercase italic">
        <Clock className="text-blue-500" size={20} /> Task Pipeline
      </h3>

      {/* INPUT AREA */}
      <div className="mb-10 space-y-3">
        <textarea 
          value={customMsg}
          onChange={(e) => setCustomMsg(e.target.value)}
          placeholder="New task note..."
          className="w-full h-24 bg-[var(--color-background-primary)] border border-[var(--color-border-secondary)] rounded-2xl p-4 text-xs font-bold outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner text-[var(--color-text-primary)] placeholder:opacity-30"
        />
        <button 
          onClick={handleAddFollowUp}
          disabled={isSubmitting}
          className="w-full py-3 bg-[var(--color-background-primary)] text-[var(--color-text-primary)] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-black/5"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <BellPlus size={14} />}
          Add to Timeline
        </button>
      </div>

      {/* TIMELINE LIST */}
      <div className="space-y-8 relative">
        {followUps.length > 0 ? (
          followUps.map((f, i) => (
            <div key={f._id || i} className="group relative pl-8 border-l-2 border-dashed border-[var(--color-border-secondary)] last:border-0 pb-8 last:pb-0">

              {/* ACTION BUTTONS */}
              <div className=" absolute right-0 mb-2 flex items-center gap-1">
                {editId === f._id ? (
                  <button onClick={() => handleSaveEdit(f._id)} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg">
                    <Save size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => { setEditId(f._id); setEditMsg(f.message); }} 
                    className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
                
                <button 
                  onClick={() => dispatch(deleteFollowUp(f._id))}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                >
                  <X size={14} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  {new Date(f.followUpDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
                
                {editId === f._id ? (
                  <input 
                    autoFocus
                    value={editMsg}
                    onChange={(e) => setEditMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(f._id)}
                    className="w-full bg-[var(--color-background-primary)] border border-blue-500/30 rounded-lg px-2 py-1 text-sm font-bold outline-none text-[var(--color-text-primary)]"
                  />
                ) : (
                  <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight tracking-tight pr-12 transition-all">
                    {f.message}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 opacity-40">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-placeholder)]">No Active Tasks</p>
          </div>
        )}
      </div>
    </section>
  );
}