"use client";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateResumePhase } from "@lib/redux/features/resumes/resumeeditor/slice";
import { 
  Bold, Italic, Underline, List, MousePointer2, 
  RotateCcw, Sparkles, Type, AlignLeft, MoveVertical, MoveHorizontal, 
  CaseSensitive, Weight
} from "lucide-react";

const FONT_OPTIONS = [
  { label: "Default (Sans)", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Lora", value: "'Lora', serif" },
];

export default function DesignTab({ selectedContainer }) {
  const dispatch = useDispatch();
  const { formDataMap } = useSelector((state) => state.resumeEditor, shallowEqual);
  
  if (!formDataMap?.designConfig) return null;
  const { designConfig } = formDataMap;

  const currentStyles = designConfig.containers?.[selectedContainer]?.style || {};

  const updateStyle = (newStyle) => {
    if (!selectedContainer) return;
    const prevStyle = designConfig.containers?.[selectedContainer]?.style || {};
    dispatch(updateResumePhase({
      phaseKey: "designConfig",
      data: {
        ...designConfig,
        containers: { 
          ...designConfig.containers, 
          [selectedContainer]: { style: { ...prevStyle, ...newStyle } } 
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
        Style Editor
      </div>

      {!selectedContainer ? (
        <div className="border-2 border-dashed border-[var(--color-border-primary)] p-12 text-center rounded-2xl bg-[var(--color-background-tertiary)]/30">
          <MousePointer2 size={32} className="mx-auto mb-4 opacity-30 animate-pulse" />
          <p className="text-xs text-[var(--color-text-placeholder)] font-medium leading-relaxed">
            Click any section on the resume <br /> to edit colors and spacing.
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
          
          {/* Header Info */}
          <div className="bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] p-3 rounded-lg text-xs font-bold flex justify-between items-center border border-[var(--color-button-primary-bg)]/20 shadow-sm">
            <span className="flex items-center gap-2">
              <Sparkles size={14} /> 
              Editing: {selectedContainer.replace(/([A-Z]|_)/g, ' $1').toLowerCase()}
            </span>
            <RotateCcw 
              size={14} 
              className="cursor-pointer hover:rotate-[-45deg] transition-transform" 
              onClick={handleReset} 
            />
          </div>

          {/* Typography: Font Family */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-1.5 ml-1">
              <CaseSensitive size={14} /> Font Type
            </span>
            <select 
              value={currentStyles.fontFamily || ""}
              onChange={(e) => updateStyle({ fontFamily: e.target.value })}
              className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-[var(--color-button-primary-bg)] outline-none cursor-pointer transition-all"
            >
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Formatting Toggles */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase ml-1">Text Formatting</span>
            <div className="flex gap-1 bg-[var(--color-background-tertiary)] p-1 rounded-xl">
              {[
                { icon: <Bold size={18}/>, prop: 'fontWeight', val: 'bold', clear: 'normal' },
                { icon: <Italic size={18}/>, prop: 'fontStyle', val: 'italic', clear: 'normal' },
                { icon: <Underline size={18}/>, prop: 'textDecoration', val: 'underline', clear: 'none' },
                { icon: <List size={18}/>, prop: 'display', val: 'list-item', clear: 'block' }
              ].map((btn, i) => {
                const isActive = currentStyles[btn.prop] === btn.val;
                return (
                  <button 
                    key={i}
                    onClick={() => updateStyle({ [btn.prop]: isActive ? btn.clear : btn.val })}
                    className={`flex-1 py-2.5 rounded-lg flex justify-center transition-all ${isActive ? "bg-[var(--color-background-secondary)] text-[var(--color-button-primary-bg)] shadow-sm border border-[var(--color-border-primary)]" : "text-[var(--color-text-placeholder)] hover:text-[var(--color-text-primary)]"}`}
                  >
                    {btn.icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase ml-1">Text Color</span>
              <div className="flex items-center gap-2 bg-[var(--color-background-secondary)] p-2 rounded-xl border border-[var(--color-border-primary)]">
                <input type="color" value={currentStyles.color || "#0A1F44"} onChange={(e) => updateStyle({ color: e.target.value })} className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent" />
                <span className="text-[10px] font-mono uppercase font-bold">{currentStyles.color || "#0A1F44"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase ml-1">Accent BG</span>
              <div className="flex items-center gap-2 bg-[var(--color-background-secondary)] p-2 rounded-xl border border-[var(--color-border-primary)]">
                <input type="color" value={currentStyles.backgroundColor || "#ffffff"} onChange={(e) => updateStyle({ backgroundColor: e.target.value })} className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent" />
                <span className="text-[10px] font-mono uppercase font-bold">{currentStyles.backgroundColor || "#fff"}</span>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-6 pt-2">
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-1.5 ml-1">
                  <Type size={12}/> Font Size
                </span>
                <span className="text-[10px] font-bold text-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)] px-2 py-0.5 rounded">{currentStyles.fontSize || "11px"}</span>
              </div>
              <input type="range" min="8" max="64" value={parseInt(currentStyles.fontSize) || 11} onChange={(e) => updateStyle({ fontSize: `${e.target.value}px` })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
            </div>

            {/* Font Weight */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-1.5 ml-1">
                  <Weight size={12}/> Font Weight
                </span>
                <span className="text-[10px] font-bold text-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)] px-2 py-0.5 rounded">{currentStyles.fontWeight || "400"}</span>
              </div>
              <input type="range" min="100" max="900" step="100" value={parseInt(currentStyles.fontWeight) || 400} onChange={(e) => updateStyle({ fontWeight: e.target.value })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
            </div>

            {/* Line Height */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-1.5 ml-1">
                  <AlignLeft size={12}/> Line Height
                </span>
                <span className="text-[10px] font-bold text-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)] px-2 py-0.5 rounded">{currentStyles.lineHeight || "1.5"}</span>
              </div>
              <input type="range" min="1" max="3" step="0.1" value={parseFloat(currentStyles.lineHeight) || 1.5} onChange={(e) => updateStyle({ lineHeight: e.target.value })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
            </div>

            {/* Position Y */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-1.5 ml-1">
                  <MoveVertical size={12}/> Position Y
                </span>
                <span className="text-[10px] font-bold text-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)] px-2 py-0.5 rounded">{currentStyles.marginTop || "0px"}</span>
              </div>
              <input type="range" min="-50" max="100" value={parseInt(currentStyles.marginTop) || 0} onChange={(e) => updateStyle({ marginTop: `${e.target.value}px` })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
            </div>

            {/* Position X */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase flex items-center gap-1.5 ml-1">
                  <MoveHorizontal size={12}/> Position X
                </span>
                <span className="text-[10px] font-bold text-[var(--color-button-primary-bg)] bg-[var(--color-button-secondary-bg)] px-2 py-0.5 rounded">{currentStyles.paddingLeft || "0px"}</span>
              </div>
              <input type="range" min="0" max="150" value={parseInt(currentStyles.paddingLeft) || 0} onChange={(e) => updateStyle({ paddingLeft: `${e.target.value}px` })} className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary-bg)]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}