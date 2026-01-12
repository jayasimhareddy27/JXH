"use client";

import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { saveResumeById } from "@lib/redux/features/resumes/resumeeditor/thunks";
import { updateResumePhase } from "@lib/redux/features/resumes/resumeeditor/slice";
import { layouts } from "./constants";
import { 
  Bold, Italic, Underline, List, 
  MoveHorizontal, MoveVertical, Type, 
  Palette, MousePointer2, RotateCcw, Save,
  Layout as LayoutIcon, Settings2, Sparkles
} from "lucide-react";

export default function ResumeDesignEditor({ resumeId, selectedContainer }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { formDataMap } = useSelector((state) => state.resumeEditor, shallowEqual);

  if (!formDataMap?.designConfig) return null;
  const { designConfig } = formDataMap;

  const currentStyles = designConfig.containers?.[selectedContainer]?.style || {};

  const setLayout = (layoutId) => {
    dispatch(updateResumePhase({
      phaseKey: "designConfig",
      data: { ...designConfig, layout: layoutId },
    }));
  };

  const updateStyle = (newStyle) => {
    if (!selectedContainer) return;
    const prevStyle = designConfig.containers?.[selectedContainer]?.style || {};
    
    dispatch(updateResumePhase({
      phaseKey: "designConfig",
      data: {
        ...designConfig,
        containers: {
          ...designConfig.containers,
          [selectedContainer]: { style: { ...prevStyle, ...newStyle } },
        },
      },
    }));
  };

  const handleReset = () => {
    if (!selectedContainer) return;
    const updatedContainers = { ...designConfig.containers };
    delete updatedContainers[selectedContainer];

    dispatch(updateResumePhase({
      phaseKey: "designConfig",
      data: { ...designConfig, containers: updatedContainers },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(saveResumeById({ resumeId })).unwrap();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[var(--color-background-primary)] text-[var(--color-text-primary)] border-r border-[var(--color-border-primary)] transition-colors duration-300">
      <div className="flex-1 space-y-10 overflow-y-auto p-5 custom-scrollbar">
        
        {/* PAGE STRUCTURE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
            <LayoutIcon size={14} /> Page Structure
          </div>
          <div className="grid grid-cols-2 gap-3">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id)}
                className={`
                  rounded-xl p-3 text-left transition-all duration-200 border-2
                  ${designConfig.layout === l.id 
                    ? "border-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)] ring-2 ring-[var(--color-button-primary-bg)]/20" 
                    : "border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] hover:border-[var(--color-text-secondary)]"}
                `}
              >
                <div className={`text-[13px] font-bold ${designConfig.layout === l.id ? "text-[var(--color-button-primary-bg)]" : ""}`}>
                  {l.label}
                </div>
              </button>
            ))}
          </div>
        </section>

        <hr className="border-[var(--color-border-primary)]" />

        {/* STYLE EDITOR */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
              <Settings2 size={14} /> Style Editor
            </div>
            {selectedContainer && (
              <button 
                onClick={handleReset}
                className="text-[10px] flex items-center gap-1 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 px-2 py-1 rounded-md transition-all font-bold"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          {!selectedContainer ? (
            <div className="rounded-2xl border-2 border-dashed border-[var(--color-border-primary)] p-12 text-center bg-[var(--color-background-tertiary)] text-[var(--color-text-placeholder)]">
              <MousePointer2 size={32} className="mx-auto mb-4 opacity-40 animate-bounce" />
              <p className="text-sm font-medium leading-relaxed">
                Select a section on the resume to edit colors and spacing.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* CURRENT TARGET */}
              <div className="bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] p-3 rounded-lg border border-[var(--color-button-primary-bg)]/20 text-xs font-bold capitalize flex items-center gap-2">
                <Sparkles size={14} className="animate-pulse" />
                Editing: {selectedContainer.replace(/([A-Z])/g, ' $1')}
              </div>

              {/* COLORS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[var(--color-text-secondary)]">Text Color</span>
                  <div className="flex items-center gap-2 bg-[var(--color-background-secondary)] p-2 rounded-lg border border-[var(--color-border-primary)]">
                    <input 
                      type="color" 
                      value={currentStyles.color || "#000000"} 
                      onChange={(e) => updateStyle({ color: e.target.value })}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-[var(--color-text-primary)] uppercase">{currentStyles.color || "#000"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[var(--color-text-secondary)]">Background</span>
                  <div className="flex items-center gap-2 bg-[var(--color-background-secondary)] p-2 rounded-lg border border-[var(--color-border-primary)]">
                    <input 
                      type="color" 
                      value={currentStyles.backgroundColor || "#ffffff"} 
                      onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-[var(--color-text-primary)] uppercase">{currentStyles.backgroundColor || "#fff"}</span>
                  </div>
                </div>
              </div>

              {/* FORMATTING */}
              <div className="flex gap-1 bg-[var(--color-background-tertiary)] p-1 rounded-xl">
                {[
                  { icon: <Bold size={18}/>, prop: 'fontWeight', val: 'bold', clear: 'normal' },
                  { icon: <Italic size={18}/>, prop: 'fontStyle', val: 'italic', clear: 'normal' },
                  { icon: <Underline size={18}/>, prop: 'textDecoration', val: 'underline', clear: 'none' },
                  { icon: <List size={18}/>, prop: 'display', val: 'list-item', clear: 'block' }
                ].map((btn, i) => (
                  <button 
                    key={i}
                    onClick={() => updateStyle({ [btn.prop]: currentStyles[btn.prop] === btn.val ? btn.clear : btn.val })}
                    className={`flex-1 py-2 rounded-lg flex justify-center transition-all ${currentStyles[btn.prop] === btn.val ? "bg-[var(--color-background-secondary)] text-[var(--color-button-primary-bg)] shadow-lg scale-105 border border-[var(--color-border-primary)]" : "text-[var(--color-text-placeholder)] hover:text-[var(--color-text-primary)]"}`}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>

              {/* RULERS */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Font Size</span>
                    <span className="text-[10px] font-mono text-[var(--color-button-primary-bg)] font-bold">{currentStyles.fontSize || "14px"}</span>
                  </div>
                  <input type="range" min="8" max="64" value={parseInt(currentStyles.fontSize) || 14} onChange={(e) => updateStyle({ fontSize: `${e.target.value}px` })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-nowrap gap-2">
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Vertical (Y)</span>
                    <span className="text-[10px] font-mono text-[var(--color-button-primary-bg)] font-bold">{currentStyles.marginTop || "0px"}</span>
                  </div>
                  <input type="range" min="-40" max="80" value={parseInt(currentStyles.marginTop) || 0} onChange={(e) => updateStyle({ marginTop: `${e.target.value}px` })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-nowrap gap-2">
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Horizontal (X)</span>
                    <span className="text-[10px] font-mono text-[var(--color-button-primary-bg)] font-bold">{currentStyles.paddingLeft || "0px"}</span>
                  </div>
                  <input type="range" min="0" max="120" value={parseInt(currentStyles.paddingLeft) || 0} onChange={(e) => updateStyle({ paddingLeft: `${e.target.value}px` })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-[var(--color-background-secondary)] border-t border-[var(--color-border-primary)] shadow-2xl transition-colors duration-300">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-cta-bg)] p-4 text-sm font-black uppercase tracking-widest text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover-bg)] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-cta-text)] border-t-transparent" /> : <Save size={18}/>}
          {loading ? "Syncing..." : "Push to Cloud"}
        </button>
      </div>
    </div>
  );
}