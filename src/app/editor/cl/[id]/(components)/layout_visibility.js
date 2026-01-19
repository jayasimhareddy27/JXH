"use client";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateResumePhase, selectContainer } from "@lib/redux/features/resumes/resumeeditor/slice";
import { Eye, EyeOff, Layout as LayoutIcon, Columns, Box, ListTree, RotateCcw } from "lucide-react";

export default function LayoutVisibilityTab({ activeTemplateObj, selectedContainer }) {
  const dispatch = useDispatch();
  const { formDataMap } = useSelector((state) => state.resumeEditor, shallowEqual);
  
  if (!formDataMap?.designConfig) return null;
  const { designConfig } = formDataMap;
  const visibility = designConfig.visibility || {};
  
  // 1. Dynamic Hidden Items List (The "Trash" or "Archive")
  const hiddenItems = Object.entries(visibility).filter(([_, isVisible]) => isVisible === false);

  const toggleVisibility = (id) => {
    dispatch(updateResumePhase({
      phaseKey: "designConfig",
      data: { 
        ...designConfig, 
        visibility: { ...visibility, [id]: visibility[id] === false ? true : false } 
      },
    }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* SECTION A: Contextual Controls (Shows when you click a resume element) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
          <Box size={14} /> Element Control
        </div>
        
        {!selectedContainer ? (
          <div className="p-6 border-2 border-dashed border-[var(--color-border-primary)] rounded-2xl text-center bg-[var(--color-background-tertiary)]/20">
            <p className="text-[10px] text-[var(--color-text-placeholder)] font-bold uppercase tracking-wider">
              Select an item on resume to toggle its visibility
            </p>
          </div>
        ) : (
          <div className="p-4 bg-[var(--color-button-secondary-bg)] rounded-2xl border border-[var(--color-button-primary-bg)]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--color-button-primary-bg)] uppercase">Active Selection</p>
                <p className="text-xs font-bold text-[var(--color-text-primary)] capitalize">
                   {selectedContainer.replace(/([A-Z]|_)/g, ' $1')}
                </p>
              </div>
              <button 
                onClick={() => toggleVisibility(selectedContainer)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-[var(--color-border-primary)] hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold"
              >
                <EyeOff size={14} /> Hide Selection
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION B: Hidden Items Inventory (One place for all invisible items) */}
      {hiddenItems.length > 0 && (
        <section className="space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-red-500 uppercase tracking-widest">
            <EyeOff size={14} /> Hidden Items ({hiddenItems.length})
          </div>
          <div className="grid grid-cols-1 gap-2">
            {hiddenItems.map(([id]) => (
              <div key={id} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl">
                <span className="text-[10px] font-bold text-red-800 uppercase tracking-tight truncate max-w-[150px]">
                  {id.replace(/([A-Z]|_)/g, ' $1')}
                </span>
                <button 
                  onClick={() => toggleVisibility(id)}
                  className="p-1.5 hover:bg-white rounded-lg text-red-600 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION C: Standard Page Structure */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
          <Columns size={14} /> Page Layout
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(activeTemplateObj?.layout || {}).map((key) => (
            <button
              key={key}
              onClick={() => dispatch(updateResumePhase({ phaseKey: "designConfig", data: { ...designConfig, layout: key }}))}
              className={`rounded-xl p-3 text-left transition-all border-2 ${designConfig.layout === key ? "border-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)]" : "border-[var(--color-border-primary)]"}`}
            >
              <div className="text-[11px] font-bold capitalize">{key} Mode</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}