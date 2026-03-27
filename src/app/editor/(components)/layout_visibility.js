"use client";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updatePhase, selectContainer } from "@lib/redux/features/editor/slice";
import { EyeOff, Box, Columns, RotateCcw, Trash2, ChevronRight } from "lucide-react";

export default function LayoutVisibilityTab({ activeTemplateObj, selectedContainer }) {
  const dispatch = useDispatch();
  const { formDataMap } = useSelector((state) => state.editor, shallowEqual);
  
  if (!formDataMap?.designConfig) return null;
  const { designConfig } = formDataMap;
  const visibility = designConfig.visibility || {};
  
  // 1. Grouping Logic: Categorize hidden items by their prefix (e.g., "job", "edu", "cert")
  const hiddenEntries = Object.entries(visibility).filter(([_, isVisible]) => isVisible === false);
  
  const groupedHiddenItems = hiddenEntries.reduce((acc, [id]) => {
    let category = "General";
    if (id.startsWith("job") || id.includes("Experience")) category = "Experience";
    else if (id.startsWith("edu") || id.includes("Education")) category = "Education";
    else if (id.startsWith("project")) category = "Projects";
    else if (id.startsWith("cert")) category = "Certifications";
    else if (id.includes("career") || id.includes("Summary")) category = "Summary";
    else if (id.includes("Skill") || id.includes("technical") || id.includes("tools")) category = "Skills";
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(id);
    return acc;
  }, {});

  const toggleVisibility = (id, shouldDeselect = false) => {
    dispatch(updatePhase({
      phaseKey: "designConfig",
      data: { 
        ...designConfig, 
        visibility: { ...visibility, [id]: visibility[id] === false ? true : false } 
      },
    }));
    if (shouldDeselect) dispatch(selectContainer(null));
  };

  const resetAllVisibility = () => {
    dispatch(updatePhase({
      phaseKey: "designConfig",
      data: { ...designConfig, visibility: {} },
    }));
  };

  const formatId = (id) => {
    return id
      .replace(/([A-Z]|_)/g, ' $1') // Space before capitals/underscores
      .replace(/[0-9]/g, (m) => ` #${parseInt(m) + 1}`) // Index to human-readable count
      .trim();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* SECTION A: Contextual Controls */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <Box size={14} /> Element Control
          </div>
          {hiddenEntries.length > 0 && (
            <button onClick={resetAllVisibility} className="text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
              <RotateCcw size={12} /> Reset All
            </button>
          )}
        </div>
        
        {!selectedContainer ? (
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
              Select any item on the resume <br /> to toggle its visibility
            </p>
          </div>
        ) : (
          <div className="p-4 bg-[var(--color-button-secondary-bg)] rounded-2xl border border-[var(--color-button-primary-bg)]/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-[var(--color-button-primary-bg)] uppercase mb-1">Active Selection</p>
                <p className="text-xs font-bold text-[var(--color-text-primary)] capitalize">
                   {formatId(selectedContainer)}
                </p>
              </div>
              <button 
                onClick={() => toggleVisibility(selectedContainer, true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-red-100 hover:bg-red-50 text-red-500 transition-all text-xs font-bold"
              >
                <Trash2 size={14} /> Hide
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION B: Categorized Hidden Inventory */}
      {hiddenEntries.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <EyeOff size={14} /> Hidden by Category
          </div>
          
          <div className="space-y-3">
            {Object.entries(groupedHiddenItems).map(([category, items]) => (
              <div key={category} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50/50 px-3 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{category}</span>
                  <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">{items.length}</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {items.map((id) => (
                    <div key={id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors group">
                      <span className="text-[10px] font-medium text-slate-600 truncate pr-2">
                        {formatId(id)}
                      </span>
                      <button 
                        onClick={() => toggleVisibility(id)}
                        className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
                        title="Restore"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION C: Page Layout */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <Columns size={14} /> Layout Mode
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(activeTemplateObj?.layout || {}).map((key) => {
            const isActive = designConfig.layout === key;
            return (
              <button
                key={key}
                onClick={() => dispatch(updatePhase({ phaseKey: "designConfig", data: { ...designConfig, layout: key }}))}
                className={`p-4 text-left rounded-xl border-2 transition-all ${
                  isActive 
                  ? "border-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)] shadow-md" 
                  : "border-slate-100 hover:border-slate-200 bg-white"
                }`}
              >
                <div className={`text-[11px] font-black uppercase ${isActive ? "text-[var(--color-button-primary-bg)]" : "text-slate-400"}`}>
                  {key}
                </div>
                <div className="text-[9px] text-slate-400 mt-1 font-bold uppercase opacity-50">Template View</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}