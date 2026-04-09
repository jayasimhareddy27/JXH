"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { saveDocumentById, fetchAIdataforDocument } from "@lib/redux/features/editor/thunks";
import { markAIPrimaryResume } from "@lib/redux/features/resumes/resumecrud/thunks"; // Use your existing thunk
import { setCurrentJob } from "@lib/redux/features/job/slice";
import { Save, LayoutGrid, Palette, FileText, Eye, Target, Loader2, Briefcase, ChevronDown, BarChart3, RefreshCw, Info } from "lucide-react";

// Sub-tab Components
import DesignTab from "../(components)/design";
import DetailsTab from "../(components)/details";
import LayoutVisibilityTab from "../(components)/layout_visibility";
import SummaryTab from "../(components)/summary";
import AtsTab from "../(components)/ats";
import SelectTemplateTab from "../(components)/selecttemplate";

const TABS = [{ id: "details", icon: <FileText size={18} />, label: "Content" },{ id: "ats", icon: <Target size={18} />, label: "Ats" },{ id: "design", icon: <Palette size={18} />, label: "Design" }, { id: "template", icon: <LayoutGrid size={18} />, label: "Template" },{ id: "summary", icon: <BarChart3 size={18} />, label: "Summary" },{ id: "visibility", icon: <Eye size={18} />, label: "Visibility" },];

export default function DesignEditor({ type, selectedContainer, activeTemplateObj, templates }) {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState("details");
  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const { formDataMap, trackerListing, currentJob, aiResumeRef, allResumes, isJobHydrated } = useSelector(  (state) => ({ formDataMap: state.editor.formDataMap, trackerListing: state.jobsStore?.trackerListing || [], currentJob: state.jobsStore?.currentJob || null, isJobHydrated: state.jobsStore?.hydrated, aiResumeRef: state.resumecrud?.aiResumeRef || null, allResumes: state.resumecrud?.allResumes || [],}), shallowEqual);
  const toggleAccordion = (key) => {
    setActivePhaseKey(prev => prev === key ? null : key);
  };

  // Updates the Job Optimization Context (Redux + Persistence)
  const handleJobChange = (e) => {
    const jobObj = trackerListing.find(j => j._id === e.target.value) || null;
    dispatch(setCurrentJob(jobObj));
  };

  // Updates the AI Knowledge Base (API + Redux + Persistence)
  const handleAiResumeChange = (e) => dispatch(markAIPrimaryResume(e.target.value));

  const handleFetchFromAI = useCallback(async (phase) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    
    try {
      await dispatch(fetchAIdataforDocument({
        type: type === "resume" ? "resume" : "coverletter",
        sectionIds: phase.id ? [phase.id] : (phase.sectionIds || []),
        signal: abortControllerRef.current.signal,
      })).unwrap();
      setActivePhaseKey(phase.key);
    } catch (e) { console.error(e); }
  }, [dispatch, type]);

  const handleSave = async () => {
    setLoading(true);
    try { await dispatch(saveDocumentById()).unwrap(); } 
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (!formDataMap || !isJobHydrated) return null;

  return (
    <div className="flex h-full flex-col bg-[var(--color-background-primary)] border-r border-[var(--color-border-primary)] shadow-inner">
      
      <nav className="grid grid-cols-3 sticky top-0 z-20 border-b border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/80 backdrop-blur-md">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`group relative flex flex-col items-center justify-center py-4 transition-all ${activeTab === tab.id ? "text-[var(--color-button-primary-bg)]" : "text-[var(--color-text-placeholder)] hover:text-[var(--color-text-primary)]"}`}>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--color-button-primary-bg)] shadow-[0_-2px_8px_var(--color-button-primary-bg)]" />}
            <div className={`transition-transform duration-200 ${activeTab === tab.id ? "scale-110" : "group-hover:scale-105"}`}>{tab.icon}</div>
            <span className="mt-1.5 text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        
        {/* DUAL REFERENCE BAR */}
{["details", "ats"].includes(activeTab) && (
  <div className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border-primary)] p-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
    
    <div className="flex items-center gap-2">
      {/* STEP 1: THE SOURCE */}
      <p className="px-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
        Updating <span className="text-cyan-600 text-[10px]">{formDataMap?.name || "Resume"}</span> using:
      </p>
      <div className="relative ">
        <FileText size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none" />
        <select  value={aiResumeRef || ""}  onChange={handleAiResumeChange}
          className="w-full pl-6 pr-5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 appearance-none outline-none focus:ring-1 focus:ring-cyan-500/30 cursor-pointer">
          <option value="" disabled>Select Resume...</option>
          {allResumes.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-300" />
      </div>

      <div className="text-[8px] font-black text-slate-300 tracking-tighter">FOR</div>

      {/* STEP 2: THE GOAL */}
      <div className="relative ">
        <Target size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none" />
        <select 
          value={currentJob?._id || ""} 
          onChange={handleJobChange}
          className="w-full pl-6 pr-5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 appearance-none outline-none focus:ring-1 focus:ring-rose-500/30 cursor-pointer"
        >
          <option value="">General Edit</option>
          {trackerListing.map(j => <option key={j._id} value={j._id}>{j.position}</option>)}
        </select>
        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-300" />
      </div>
    </div>
  </div>
)}

        {/* TAB CONTENT AREA */}
        <div className="mx-auto max-w-sm">
          {activeTab === "template" && <SelectTemplateTab templates={templates} />}
          {activeTab === "design" && <DesignTab selectedContainer={selectedContainer} activeTemplateObj={activeTemplateObj} />}
          {activeTab === "details" && <DetailsTab type={type} expandedPhase={activePhaseKey} toggleAccordion={toggleAccordion} handleFetchFromAI={handleFetchFromAI} handleSave={handleSave} />}
          {activeTab === "visibility" && <LayoutVisibilityTab activeTemplateObj={activeTemplateObj} selectedContainer={selectedContainer} />}
          {activeTab === "summary" && <SummaryTab formDataMap={formDataMap} />}
          {activeTab === "ats" && <AtsTab formDataMap={formDataMap} displayJob={currentJob} />}
        </div>
      </main>

      <footer className="mt-auto p-4 bg-gradient-to-t from-[var(--color-background-secondary)] to-transparent">
        <button onClick={handleSave} disabled={loading} className="group relative w-full rounded-xl bg-[var(--color-text-primary)] p-4 shadow-xl active:scale-[0.98] disabled:opacity-70">
          <div className="relative flex items-center justify-center gap-3 text-[var(--color-text-on-primary)]">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span className="text-xs font-black uppercase tracking-widest">{loading ? "Syncing..." : "Save Changes"}</span>
          </div>
        </button>
      </footer>
    </div>
  );
}