"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { saveDocumentById, fetchAIdataforDocument } from "@lib/redux/features/editor/thunks";
import { markAIPrimaryResume } from "@lib/redux/features/resumes/resumecrud/thunks";
import { setCurrentJob } from "@lib/redux/features/job/slice";
import { Save, LayoutGrid, Palette, FileText, Eye, Target, Loader2, ChevronDown, BarChart3 } from "lucide-react";

import DesignTab from "../(components)/design";
import DetailsTab from "../(components)/details";
import LayoutVisibilityTab from "../(components)/layout_visibility";
import SummaryTab from "../(components)/summary";
import AtsTab from "../(components)/ats";
import SelectTemplateTab from "../(components)/selecttemplate";

const TABS = [
  { id: "details", icon: <FileText size={18} />, label: "Content" },
  { id: "ats", icon: <Target size={18} />, label: "Ats" },
  { id: "design", icon: <Palette size={18} />, label: "Design" },
  { id: "template", icon: <LayoutGrid size={18} />, label: "Template" },
  { id: "summary", icon: <BarChart3 size={18} />, label: "Summary" },
  { id: "visibility", icon: <Eye size={18} />, label: "Visibility" },
];

export default function DesignEditor({ type, selectedContainer, activeTemplateObj, templates }) {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState("details");
  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [loading, setLoading] = useState(false);

  // FIXED SELECTOR: Added null checks (optional chaining) to every single slice
  const { formDataMap, trackerListing, currentJob, aiResumeRef, allResumes, isJobHydrated } = useSelector((state) => ({
    formDataMap: state.editor?.formDataMap || null,
    trackerListing: state.jobsStore?.trackerListing || [],
    currentJob: state.jobsStore?.currentJob || null,
    isJobHydrated: state.jobsStore?.hydrated || false,
    aiResumeRef: state.resumecrud?.aiResumeRef || null,
    allResumes: state.resumecrud?.allResumes || [],
  }), shallowEqual);

  const toggleAccordion = (key) => setActivePhaseKey(prev => prev === key ? null : key);
  const handleJobChange = (e) => dispatch(setCurrentJob(trackerListing.find(j => j._id === e.target.value) || null));
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

  // SAFETY RENDER: Ensure we don't try to render if crucial data is missing
  if (!formDataMap || !isJobHydrated) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center opacity-50">
        <Loader2 size={24} className="animate-spin mb-2" />
        <p className="text-xs font-bold uppercase tracking-widest">Hydrating Editor...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[var(--color-background-primary)] border-r border-[var(--color-border-primary)] shadow-inner">
      <nav className="grid grid-cols-3 sticky top-0 z-50 border-b border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/80 backdrop-blur-md">
        {TABS.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`group relative flex flex-col items-center justify-center py-4 transition-all ${activeTab === tab.id ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
          >
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500" />}
            <div className={`transition-transform duration-200 ${activeTab === tab.id ? "scale-110" : ""}`}>{tab.icon}</div>
            <span className="mt-1.5 text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>

<main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        
        {/* RESTORED DUAL REFERENCE BAR */}
        {["details", "ats"].includes(activeTab) && (
          <div className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border-primary)] p-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <p className="px-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                Updating <span className="text-cyan-600 text-[10px]">{formDataMap?.name || "Resume"}</span> using:
              </p>
              
              <div className="relative flex-1">
                <FileText size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none" />
                <select 
                  value={aiResumeRef || ""} 
                  onChange={handleAiResumeChange}
                  className="w-full pl-6 pr-5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 appearance-none outline-none focus:ring-1 focus:ring-cyan-500/30 cursor-pointer"
                >
                  <option value="" disabled>Select Resume...</option>
                  {allResumes.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>

              <div className="text-[8px] font-black text-slate-300 tracking-tighter uppercase">FOR</div>

              <div className="relative flex-1">
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

        <div className="p-1">
          {activeTab === "template" && <SelectTemplateTab templates={templates} />}
          {activeTab === "design" && <DesignTab selectedContainer={selectedContainer} activeTemplateObj={activeTemplateObj} />}
          {activeTab === "details" && <DetailsTab type={type} expandedPhase={activePhaseKey} toggleAccordion={toggleAccordion} handleFetchFromAI={handleFetchFromAI} handleSave={handleSave} />}
          {activeTab === "visibility" && <LayoutVisibilityTab activeTemplateObj={activeTemplateObj} selectedContainer={selectedContainer} />}
          {activeTab === "summary" && <SummaryTab formDataMap={formDataMap} />}
          {activeTab === "ats" && <AtsTab formDataMap={formDataMap} displayJob={currentJob} />}
        </div>
      </main>

      <footer className="mt-auto p-4 bg-white border-t border-[var(--color-border-primary)] z-50 sticky bottom-0">
        <button onClick={handleSave} disabled={loading} className="w-full rounded-xl bg-slate-900 p-4 shadow-xl active:scale-[0.98] disabled:opacity-70">
          <div className="relative flex items-center justify-center gap-3 text-white">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span className="text-xs font-black uppercase tracking-widest">{loading ? "Syncing..." : "Save Changes"}</span>
          </div>
        </button>
      </footer>
    </div>
  );
}