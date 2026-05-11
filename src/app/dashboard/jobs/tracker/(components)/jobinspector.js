"use client"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateJob,deleteJob } from "@lib/redux/features/job/thunks";
import { FLOW_STAGES, STAGE_STATE_MAP } from "./constants.js";
import { Loader2, FileText, BookmarkCheck, CheckCircle2,Trash2,AlertTriangle  } from "lucide-react";
import Link from "next/link.js";



export default function JobInspector({ activeJob }) {
  const dispatch = useDispatch();
  const [updatingKey, setUpdatingKey] = useState(null); 
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { allResumes = [] } = useSelector((state) => state.resumecrud);
  const { allCoverletters = [] } = useSelector((state) => state.coverlettercrud);
  
  if (!activeJob) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] opacity-50 p-10 text-center">
        <p className="font-bold">Select a job to manage status</p>
      </div>
    );
  }

  const handleUpdate = async (field, value) => {
    setUpdatingKey(value);
    await dispatch(updateJob({ jobId: activeJob._id, updates: { [field]: value } }));
    setUpdatingKey(null);
  };

  const handleDelete = async () => {
    setUpdatingKey('deleting');
    await dispatch(deleteJob(activeJob._id));
    setUpdatingKey(null);
    setShowConfirmDelete(false);
  };
  const allowedStates = STAGE_STATE_MAP[activeJob.stage] || ["pending"];
  
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-8 animate-in fade-in slide-in-from-right-4">
      {/* HEADER */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
          {activeJob.companyName}
        </h2>
        <p className="text-lg text-[var(--color-text-secondary)] font-medium">
          {activeJob.position}
        </p>
        <div className="absolute right-0 ">
                  {/* COMPACT DELETE BUTTON */}
        {!showConfirmDelete ? (
      <button 
        onClick={() => setShowConfirmDelete(true)}
        className="flex items-center gap-3 px-4 py-2 cursor-pointer text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all shrink-0 group/delete"
      >
        <span className="text-sm font-black uppercase tracking-[0.1em]">
          Delete Job
        </span>
        <Trash2 size={18} />
      </button>
          ) : (
            <div className="flex flex-col items-end gap-2 animate-in zoom-in-95">
              <div className="flex gap-1">
                  <button 
                    onClick={handleDelete}
                    disabled={updatingKey === 'deleting'}
                    className="bg-rose-500  px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-lg shadow-rose-500/20"
                  >
                    {updatingKey === 'deleting' ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Confirm
                  </button>
                  <button 
                    onClick={() => setShowConfirmDelete(false)}
                    className="bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border border-[var(--color-border-secondary)]"
                  >
                    No
                  </button>
              </div>
              <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1">
                <AlertTriangle size={10} /> Irreversible
              </span>
            </div>
          )}
        </div>
        <Link href={activeJob._id} target="_blank" className="inline-flex items-center gap-1 mt-2 text-sm text-[var(--color-button-primary-bg)] font-medium">
          View Job Posting
          <CheckCircle2 size={14} />
        </Link>


      </section>

      <hr className="border-[var(--color-border-secondary)]" />

      {/* DOCUMENTS & INDIVIDUAL ATS SCORES */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
          Application Documents
        </h3>

        <div className="space-y-4">
          {/* RESUME SELECTION */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-2">
              <BookmarkCheck size={14} className="text-[var(--color-button-primary-bg)]" /> Resume Selection
            </label>
            <div className="flex gap-2 min-w-0"> {/* min-w-0 prevents child overflow */}
              <select  value={activeJob.resumeId || ""}  onChange={(e) => handleUpdate("resumeId", e.target.value)}
                className="flex-1 min-w-0 bg-[var(--color-background-tertiary)] border border-[var(--color-border-secondary)] rounded-lg p-2 text-sm outline-none truncate"
              >
                <option value="">Select Resume</option>
                {allResumes.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              
              {/* SCORE BADGE */}
              <div className="shrink-0 w-14 h-10 flex flex-col items-center justify-center bg-[var(--color-button-secondary-bg)] rounded-lg border border-[var(--color-border-secondary)]">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">{activeJob.resumeMatchScore || 0}%</span>
                <span className="text-[8px] uppercase opacity-60">ATS</span>
              </div>
            </div>
          </div>

          {/* COVER LETTER SELECTION & SCORE */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-2">
              <FileText size={14} className="text-[var(--color-button-primary-bg)]" /> Cover Letter Selection
            </label>
            <div className="flex gap-2  min-w-0">
              <select  value={activeJob.coverLetterId || ""}  onChange={(e) => handleUpdate("coverLetterId", e.target.value)}
                className="flex-1 min-w-0 bg-[var(--color-background-tertiary)] border border-[var(--color-border-secondary)] rounded-lg p-2 text-sm outline-none truncate"
              >
                <option value="">Select Cover Letter</option>
                {allCoverletters.map(c => <option key={c._id} value={c._id}>{c.name || c.title}</option>)}
              </select>
            </div>
          </div>
        </div>


      </section>

      <hr className="border-[var(--color-border-secondary)]" />

      {/* PIPELINE CONTROLS */}
      <section className="space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3">Pipeline Stage</p>
          <div className="flex flex-wrap gap-2">
            {FLOW_STAGES.filter(s => s.key !== "all").map((s) => {
              const isCurrent = activeJob.stage === s.key;
              const isLoading = updatingKey === s.key;
              return (
                <button
                  key={s.key}
                  disabled={!!updatingKey}
                  onClick={() => handleUpdate("stage", s.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase transition-all
                    ${isCurrent ? "bg-[var(--color-button-primary-bg)] text-white" : "bg-[var(--color-button-secondary-bg)] text-[var(--color-text-secondary)]"}
                    ${updatingKey && !isLoading ? "opacity-50" : ""}`}
                >
                  {isLoading && <Loader2 size={12} className="animate-spin" />}
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3">Status in {activeJob.stage}</p>
          <div className="flex flex-wrap gap-2">
            {allowedStates.map((st) => {
              const isCurrent = activeJob.state === st;
              const isLoading = updatingKey === st;
              return (
                <button
                  key={st}
                  disabled={!!updatingKey}
                  onClick={() => handleUpdate("state", st)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase border transition-all
                    ${isCurrent ? "border-[var(--color-button-primary-bg)] text-[var(--color-button-primary-bg)]" : "border-transparent bg-[var(--color-button-secondary-bg)] text-[var(--color-text-secondary)] opacity-60"}
                    ${updatingKey && !isLoading ? "opacity-50" : ""}`}
                >
                  {isLoading && <Loader2 size={12} className="animate-spin" />}
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}