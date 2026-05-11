"use client";
import {  ChevronDown, ExternalLink, FileText, PenTool } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateJob } from "@lib/redux/features/job/thunks";
import { useRouter } from "next/navigation";

export default function ActionSidebar({ job }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { allResumes = [] } = useSelector((state) => state.resumecrud);
  const { allCoverletters = [] } = useSelector((state) => state.coverlettercrud || { allCoverletters: [] });

  const handleLink = (field, val) => dispatch(updateJob({ jobId: job._id, updates: { [field]: val } }));

  return (
    <section className="bg-[var(--color-background-secondary)] rounded-[2rem] p-6 border border-[var(--color-border-secondary)] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border-secondary)] pb-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-placeholder)]">Linked Assets</h3>
      </div>

      {/* COMPACT RESUME SELECT */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select 
            value={job.resumeId || ""} 
            onChange={(e) => handleLink("resumeId", e.target.value)}
            className="text-center w-full bg-[var(--color-background-primary)] border border-[var(--color-border-secondary)] rounded-xl py-2 px-3 text-[11px] font-bold outline-none appearance-none"
          >
            <option value="">Select Resume</option>
            {allResumes.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
          <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-90" />
        </div>
        <button 
          onClick={() => router.push(`/editor/cv/${job.resumeId}`)}
          disabled={!job.resumeId}
          className="p-2 bg-[var(--color-background-tertiary)] rounded-xl hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-20"
        >
          <ExternalLink size={14} />
        </button>
      </div>

      {/* COMPACT COVER LETTER SELECT */}
      <div className="flex gap-2 ">
        <div className="relative flex-1 ">
          <select 
            value={job.coverLetterId || ""} 
            onChange={(e) => handleLink("coverLetterId", e.target.value)}
            className="text-center w-full bg-[var(--color-background-primary)] border border-[var(--color-border-secondary)] rounded-xl py-2 px-3 text-[11px] font-bold outline-none appearance-none"
          >
            <option value="">Select Letter</option>
            {allCoverletters.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-90" />
        </div>
        <button 
          onClick={() => router.push(`/editor/cl/${job.coverLetterId}`)}
          disabled={!job.coverLetterId}
          className="p-2 bg-[var(--color-background-tertiary)] rounded-xl hover:bg-blue-50 hover:text-blue-600 disabled:opacity-20"
        >
          <ExternalLink size={14} />
        </button>
      </div>


    </section>
  );
}