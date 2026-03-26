"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { saveDocumentById, fetchAIdata } from "@lib/redux/features/editor/thunks";
import { Save, LayoutGrid, Palette, FileText, Eye, Target, CloudCheck, Loader2 } from "lucide-react";

// Sub-tab Components
import DesignTab from "../(components)/design";
import DetailsTab from "../(components)/details";
import LayoutVisibilityTab from "../(components)/layout_visibility";
//import AtsTab from "../(components)/ats";
import SelectTemplateTab from "../(components)/selecttemplate";


export default function DesignEditor({ type, selectedContainer, activeTemplateObj,templates }) {
  const dispatch = useDispatch();
  
  // 1. ADD: State from original page.js to manage accordions
  const [activeTab, setActiveTab] = useState("design");
  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // 2. SELECTORS: Get AI agent config for Fetch from AI functionality
  const { formDataMap, token, aiAgent } = useSelector((state) => ({
    formDataMap: state.editor.formDataMap,
    token: state.auth.token,
    aiAgent: state.aiAgent
  }), shallowEqual);

  if (!formDataMap) return null;

  // 3. HANDLER: Toggle Accordion logic
  const toggleAccordion = useCallback((key) => {
    setActivePhaseKey((prevKey) => (prevKey === key ? null : key));
  }, []);

  // 4. HANDLER: AI Data Fetching logic moved from page.js
  const handleFetchFromAI = useCallback(async (phase) => {
    // You'll need the aiResumeRef here; it can be passed as a prop or selected from state
    // For now, this is the shell matching your page.js logic
    try {
      await dispatch(fetchAIdata({
        token,
        phase,
        aiAgentConfig: { 
          provider: aiAgent.provider, 
          model: aiAgent.agent, 
          ApiKey: aiAgent.apiKey 
        }
      })).unwrap();
      setActivePhaseKey(phase.key);
    } catch (error) {
      console.error("AI fetch failed:", error);
    }
  }, [aiAgent, dispatch, formDataMap]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(saveDocumentById()).unwrap();
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "template", icon: <LayoutGrid size={18} />, label: "Template" },
    { id: "design", icon: <Palette size={18} />, label: "Design" },
    { id: "details", icon: <FileText size={18} />, label: "Content" },
    { id: "visibility", icon: <Eye size={18} />, label: "Visibility" },
    { id: "ats", icon: <Target size={18} />, label: "ATS" },
  ];

  return (
    <div className="flex h-full flex-col bg-[var(--color-background-primary)] border-r border-[var(--color-border-primary)] shadow-inner transition-colors duration-300">
      
      {/* HEADER: Tab Navigation */}
      <nav className="grid grid-cols-3 sticky top-0 z-20 border-b border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/80 backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex flex-1 flex-col items-center justify-center py-4 transition-all hover:bg-[var(--color-background-tertiary)]/50 ${
                isActive ? "text-[var(--color-button-primary-bg)]" : "text-[var(--color-text-placeholder)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {isActive && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--color-button-primary-bg)] shadow-[0_-2px_8px_var(--color-button-primary-bg)]" />
              )}
              
              <div className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                {tab.icon}
              </div>
              <span className={`mt-1.5 text-[9px] font-black uppercase tracking-tighter transition-opacity ${isActive ? "opacity-100" : "opacity-60"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* BODY: Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
        <div className="mx-auto max-w-sm">
          {activeTab === "template" && <SelectTemplateTab templates={templates} />}
          {activeTab === "design" && (  <DesignTab selectedContainer={selectedContainer} activeTemplateObj={activeTemplateObj} />)}
          
          {/* 5. UPDATE: Pass the missing props here */}
          {activeTab === "details" && (
            <DetailsTab type={type} expandedPhase={activePhaseKey} toggleAccordion={toggleAccordion} handleFetchFromAI={handleFetchFromAI} handleSave={handleSave}/>
          )}
          
          {activeTab === "visibility" && (
            <LayoutVisibilityTab activeTemplateObj={activeTemplateObj} selectedContainer={selectedContainer}/>
          )}
          {/*{activeTab === "ats" && <AtsTab formDataMap={formDataMap} />}*/}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto p-6 bg-gradient-to-t from-[var(--color-background-secondary)] via-[var(--color-background-secondary)] to-transparent">
        <button onClick={handleSave} disabled={loading}
          className="group relative w-full overflow-hidden rounded-xl bg-[var(--color-text-primary)] p-4 shadow-xl transition-all hover:shadow-2xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-button-primary-bg)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <Loader2 size={18} className="animate-spin text-[var(--color-text-on-primary)]" />
            ) : (
              <Save size={18} className="text-[var(--color-text-on-primary)] group-hover:rotate-12 transition-transform" />
            )}
            <span className="text-sm font-black uppercase tracking-[0.15em] text-[var(--color-text-on-primary)]">
              {loading ? "Pushing Data" : "Save Changes"}
            </span>
          </div>
        </button>

      </footer>
    </div>
  );
}