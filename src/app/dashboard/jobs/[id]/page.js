"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchJobById, updateJob } from "@lib/redux/features/job/thunks";

import { 
  fetchDocumentById, 
  saveDocumentById 
} from "@lib/redux/features/editor/thunks";
import { fetchAIdataforDocument } from "@lib/redux/features/editor/thunks";

import { 
  Building2, DollarSign, Globe, Calendar, Briefcase, 
  GraduationCap, Zap, Edit3, Sparkles, CheckCircle2, 
  Loader2, ChevronDown 
} from "lucide-react";
import { fetchResumes } from "@lib/redux/features/resumes/resumecrud/thunks";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Refs for AI Flow Control
  const abortRef = useRef(null);
  const skipNextFetchRef = useRef(false);

  const [isMounted, setIsMounted] = useState(false);
  const [localStatus, setLocalStatus] = useState("");
  const [localResumeId, setLocalResumeId] = useState("");
  const [updatingKey, setUpdatingKey] = useState(null);

  const { allResumes = [] } = useSelector((state) => state.resumecrud);
  const { currentJob, loading, token } = useSelector(
    (state) => ({ 
      currentJob: state.jobsStore.currentJob, 
      loading: state.jobsStore.loading, 
      token: state.auth.token 
    }), 
    shallowEqual
  );

  // Selector for primary resume (fallback if currentJob has no resumeId)
  const primaryResumeId = allResumes.find(r => r.isPrimary)?._id || allResumes[0]?._id;

  useEffect(() => {
    setIsMounted(true);
    if (token && id) {
      dispatch(fetchJobById(id));
    }
  }, [id, token, dispatch]);

  useEffect(() => {
    if (currentJob) {
      setLocalStatus(currentJob.status);
      setLocalResumeId(currentJob.resumeId || "");
    }
  }, [currentJob]);

  const handleUpdate = async (field, value) => {
    if (value === (field === "status" ? localStatus : localResumeId)) return;
    if (field === "status") setLocalStatus(value);
    if (field === "resumeId") setLocalResumeId(value);
    
    setUpdatingKey(value);
    await dispatch(updateJob({ jobId: currentJob._id, updates: { [field]: value } }));
    setUpdatingKey(null);
  };

  // Helper: Create a Copy of the Resume
  const CreatenewResume = async () => {
    const targetResumeId = currentJob.resumeId || primaryResumeId;
    if (!targetResumeId) throw new Error("No base resume found to copy");
    const copyResponse = await fetch(`/api/resume/copy`, { // Ensure leading slash
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        resumeId: targetResumeId, 
        newName: `${currentJob.companyName}_${currentJob.position}` 
      }),
    });

    if (!copyResponse.ok) throw new Error("Failed to copy resume");
    
    const { newResume } = await copyResponse.json();

    // Link the new resume to the job
    await dispatch(updateJob({ jobId: currentJob._id, updates: { resumeId: newResume._id } }));
    await dispatch(fetchResumes()); 
    await dispatch(fetchDocumentById({ id: newResume._id, type: "resume" })).unwrap();
    
    return newResume;
  };

  // The Main AI Tailoring Flow
  const handleTailor = useCallback(async () => {
    setUpdatingKey("ai_flow");
    abortRef.current = new AbortController();
    skipNextFetchRef.current = true;

    try {
      // 1. Create the copy
      const newResume = await CreatenewResume();
      
      // 2. Fetch AI suggestions (assuming 6 and 8 are Summary/Experience sections)
      const sectionIds = [8]; 
      await dispatch(fetchAIdataforDocument({
        type: "resume",
        sectionIds,
        signal: abortRef.current.signal,
      })).unwrap();

      // 3. Save the document
      await dispatch(saveDocumentById()).unwrap();
      
      // 4. Redirect to editor
      router.push(`/editor/cv/${newResume._id}`);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Tailoring Flow Failed:", error);
        skipNextFetchRef.current = false;
      }
    } finally {
      setUpdatingKey(null);
    }
  }, [dispatch, token, currentJob, allResumes, primaryResumeId, router]);

  if (loading || !isMounted) return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-background-primary)]">
       <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--color-background-primary)]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[var(--color-background-secondary)] rounded-[2.5rem] p-6 md:p-10 border border-[var(--color-border-secondary)] shadow-sm mb-8 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-6 w-full flex-1">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(localStatus)}`}>
                  {localStatus}
                </span>
                {currentJob?.jobType && (
                  <span className="px-3 py-1 bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] rounded-full text-[10px] font-black uppercase tracking-wider">
                    {currentJob?.jobType}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[var(--color-text-primary)] tracking-tighter leading-[0.9]">
                {currentJob?.position}
              </h1>
              {/* Company & Salary Info */}
              <div className="flex flex-wrap items-center gap-y-4 gap-x-10 text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--color-background-tertiary)] rounded-lg text-[var(--color-button-primary-bg)]"><Building2 size={20} /></div>
                  <span className="font-bold text-lg">{currentJob?.companyName}</span>
                </div>
                {currentJob?.salary && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
                    <span className="text-[var(--color-text-primary)] font-black text-lg">{currentJob?.salary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION SIDEBAR */}
            <div className="flex flex-col gap-3 w-full lg:w-96">
              {currentJob?.jobUrl && (
                <a href={currentJob?.jobUrl} target="_blank" className="px-8 py-5 bg-[var(--color-button-primary-bg)] hover:brightness-110 text-white text-center font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 mb-2">
                  <Globe size={18} /> Apply Externally
                </a>
              )}
              
              <div className="bg-[var(--color-background-primary)] p-5 rounded-[2rem] border border-[var(--color-border-secondary)] space-y-4 shadow-inner">
                <p className="text-[10px] font-black text-[var(--color-text-placeholder)] uppercase tracking-widest flex items-center gap-2">
                   Resume Actions {updatingKey === "ai_flow" && <Loader2 size={12} className="animate-spin text-blue-500" />}
                </p>

                <div className="flex gap-2 items-center">
                  <div className="relative flex-1 min-w-0">
                    <select 
                      value={localResumeId} 
                      onChange={(e) => handleUpdate("resumeId", e.target.value)} 
                      disabled={updatingKey === "ai_flow"}
                      className="w-full bg-[var(--color-background-tertiary)] border border-[var(--color-border-secondary)] rounded-xl p-3 text-xs outline-none font-bold truncate focus:ring-2 focus:ring-blue-500 appearance-none transition-all disabled:opacity-50"
                    >
                      <option value="">Link a Resume</option>
                      {allResumes.map(r => (
                        <option key={r?._id} value={r?._id}>
                          {r?.name?.length > 25 ? `${r?.name.substring(0, 22)}...` : r?.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                  </div>

                  <div className="flex gap-1">
                    {localResumeId && (
                      <button 
                        onClick={() => router.push(`/editor/cv/${localResumeId}`)} 
                        className="p-3 bg-[var(--color-text-primary)] text-white rounded-xl hover:opacity-80 transition-all shadow-md"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    <button 
                      onClick={handleTailor}
                      disabled={updatingKey === "ai_flow" || (!localResumeId && !primaryResumeId)}
                      className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center border border-blue-400/20 disabled:opacity-50"
                      title="Tailor New with AI"
                    >
                      <Sparkles size={16} className={updatingKey === "ai_flow" ? "animate-pulse" : "fill-white/20"} />                      
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem icon={<Zap size={18}/>} title="Experience" value={currentJob?.seniorityLevel || "Mid-Level"} />
              <StatItem icon={<Calendar size={18}/>} title="Date Posted" value={currentJob?.postedDate ? new Date(currentJob?.postedDate).toLocaleDateString() : "Recent"} />
              <StatItem icon={<Briefcase size={18}/>} title="Profession" value="Engineering" />
              <StatItem icon={<GraduationCap size={18}/>} title="Status" value={localStatus} />
            </div>

            <section className="bg-[var(--color-background-secondary)] rounded-[2.5rem] p-8 md:p-12 border border-[var(--color-border-secondary)] shadow-sm">
              <h2 className="text-3xl font-black mb-10 text-[var(--color-text-primary)] tracking-tighter">Role Breakdown</h2>
              <div className="space-y-6">
                {currentJob?.aiDescription?.split('\n').filter(l => l.trim()).map((line, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="mt-1.5 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={14} className="text-blue-500" />
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed font-medium">{line.replace(/^- /, '')}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// Sub-components
function StatItem({ icon, title, value }) {
  return (
    <div className="bg-[var(--color-background-secondary)] p-6 rounded-[2rem] border border-[var(--color-border-secondary)] shadow-sm transition-all group">
      <div className="text-[var(--color-button-primary-bg)] mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
      <p className="text-[10px] font-black text-[var(--color-text-placeholder)] uppercase tracking-widest mb-1">{title}</p>
      <p className="text-sm font-black text-[var(--color-text-primary)] truncate" title={value}>{value}</p>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'interviewing': return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
    case 'offer': return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
    case 'rejected': return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
    case 'applied': return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
    default: return "bg-gray-100 text-gray-500";
  }
}