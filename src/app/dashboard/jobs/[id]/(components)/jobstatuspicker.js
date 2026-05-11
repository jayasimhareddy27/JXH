"use client";
import { useDispatch } from "react-redux";
import { updateJob, deleteJob } from "@lib/redux/features/job/thunks"; // Added deleteJob
import { ChevronDown, Globe, Edit3, Trash2, Loader2 } from "lucide-react";
import { FLOW_STAGES } from "../(components)/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JobStatusPicker({ job }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const selectableStages = FLOW_STAGES.filter(stage => stage.key !== "all");

  const handleStatusChange = (newStage) => {
    dispatch(updateJob({ jobId: job._id, updates: { stage: newStage } }));
  };

  const handleDelete = async () => {
    if (window.confirm("ARE YOU SURE? THIS WILL PERMANENTLY WIPE ALL DATA FOR THIS JOB.")) {
      setIsDeleting(true);
      try {
        await dispatch(deleteJob(job._id)).unwrap();
        router.push("/dashboard/jobs/tracker");
      } catch (err) {
        console.error("Deletion failed:", err);
        setIsDeleting(false);
      }
    }
  };

  const getStatusStyles = (stage) => {
    switch (stage) {
      case "applied": return "bg-blue-600 text-white border-transparent";
      case "interview": return "bg-amber-500 text-white border-transparent";
      case "offer": return "bg-emerald-600 text-white border-transparent";
      case "archived": return "bg-rose-600 text-white border-transparent";
      default: return "bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-secondary)]";
    }
  };

  return (
    <div className="flex flex-col w-full lg:w-52 gap-2">
      {/* APPLY LINK */}
      {job.jobUrl && (
        <Link 
          href={job.jobUrl} 
          target="_blank" 
          className="flex items-center justify-center gap-2 w-full h-12 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
        >
          <Globe size={14} /> Apply Externally
        </Link>
      )}

      {/* EDIT LINK */}
      <Link 
        href={`/dashboard/jobs/edit?id=${job._id}`} 
        className="flex items-center justify-center gap-2 w-full h-12 bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-secondary)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-border-secondary)] transition-all active:scale-95"
      >
        <Edit3 size={14} /> Edit Intelligence
      </Link>

      {/* STATUS DROPDOWN */}
      <div className={`relative w-full h-12 rounded-xl transition-all shadow-sm ${getStatusStyles(job.stage)}`}>
        <select
          value={job.stage || "saved"}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full h-full bg-transparent px-5 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none"
        >
          {selectableStages.map((s) => (
            <option key={s.key} value={s.key} className="bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none" />
      </div>

      <hr className="border-[var(--color-border-secondary)] my-1" />

      {/* DELETE BUTTON */}
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center justify-center gap-2 w-full h-12 group text-rose-500 hover:bg-rose-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
      >
        {isDeleting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
        )}
        {isDeleting ? "Wiping..." : "Delete Job"}
      </button>
    </div>
  );
}