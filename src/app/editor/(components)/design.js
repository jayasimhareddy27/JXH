"use client";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updatePhase } from "@lib/redux/features/editor/slice";
import { 
  Bold, Italic, RotateCcw, Type, AlignLeft, CaseSensitive, 
  Weight, Maximize, Minimize, MousePointer2, ChevronDown,
  Move, Link as LinkIcon, Space, AlignJustify
} from "lucide-react";
import { useState } from "react";

const FONT_OPTIONS = [
  { label: "Default (Sans)", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
];

export default function DesignTab({ selectedContainer,activeTemplateObj }) {
  const dispatch = useDispatch();
  
  const { formDataMap } = useSelector((state) => state.editor, shallowEqual);
  const [activeGroup, setActiveGroup] = useState("typography");

  if (!formDataMap?.designConfig) return null;
  const { designConfig } = formDataMap;
  const isGlobal = selectedContainer === 'page' || selectedContainer === 'PAGE';
  
  const currentStyles = isGlobal 
    ? (designConfig.theme || {}) 
    : (designConfig.containers?.[selectedContainer]?.style || {});

  const updateStyle = (newStyle) => {
    if (!selectedContainer) return;
    let updatedConfig = { ...designConfig };
    if (isGlobal) {
      updatedConfig.theme = { ...designConfig.theme, ...newStyle };
    } else {
      const prevStyle = designConfig.containers?.[selectedContainer]?.style || {};
      updatedConfig.containers = {
        ...designConfig.containers,
        [selectedContainer]: { style: { ...prevStyle, ...newStyle } } 
      };
    }
    dispatch(updatePhase({ phaseKey: "designConfig", data: updatedConfig }));
  };

  const handleReset = () => {
    if (!selectedContainer) return;
    let updatedConfig = { ...designConfig };
    if (isGlobal) updatedConfig.theme = {};
    else {
      const updatedContainers = { ...designConfig.containers };
      delete updatedContainers[selectedContainer];
      updatedConfig.containers = updatedContainers;
    }
    dispatch(updatePhase({ phaseKey: "designConfig", data: updatedConfig }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 px-1">
      <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
        Reset Styles               
        <button onClick={handleReset} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                <RotateCcw size={14} className={isGlobal ? 'text-white' : 'text-slate-400'} />
              </button>
      </div>

      {!selectedContainer ? (
        <div className="border-2 border-dashed border-slate-200 p-12 text-center rounded-3xl bg-slate-50/30">
          <MousePointer2 size={32} className="mx-auto mb-4 opacity-20" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Select an element to <br /> edit its geometry
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-bottom-2">
          


          {/* GROUP 1: TYPOGRAPHY (Includes Letter/Line Spacing & Link) */}
          <StyleGroup title="Typography" icon={<Type size={14}/>} isOpen={activeGroup === "typography"} onToggle={() => setActiveGroup("typography")}>
            <div className="space-y-5 pt-2">
              <select 
                value={currentStyles.fontFamily || ""}
                onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-bold outline-none"
              >
                <option value="">{isGlobal ? "Default Sans" : "Inherit from Page"}</option>
                {FONT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>

              <Slider label="Font Size" min="8" max="72" unit="px" value={currentStyles.fontSize || "12px"} onChange={(v) => updateStyle({ fontSize: v })} />
              
              <Slider label="Letter Spacing" icon={<Space size={12}/>} min="-2" max="10" step="0.5" unit="px" value={currentStyles.letterSpacing || "0px"} onChange={(v) => updateStyle({ letterSpacing: v })} />
              
              <Slider label="Line Height" icon={<AlignJustify size={12}/>} min="1" max="3" step="0.1" unit="" value={currentStyles.lineHeight || "1.5"} onChange={(v) => updateStyle({ lineHeight: v })} />

              <Slider label="Font Weight" min="100" max="900" step="100" unit="" value={currentStyles.fontWeight || "400"} onChange={(v) => updateStyle({ fontWeight: v })} />
              
              {/* Link Parameter */}
              {!isGlobal && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1.5 ml-1">
                    <LinkIcon size={12}/> Link URL
                  </span>
                  <input 
                    type="text"
                    placeholder="https://example.com"
                    value={currentStyles.href || ""}
                    onChange={(e) => updateStyle({ href: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 text-[10px] font-medium outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              )}

              <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
                <FormatBtn icon={<Bold size={16}/>} active={currentStyles.fontWeight === 'bold'} onClick={() => updateStyle({ fontWeight: currentStyles.fontWeight === 'bold' ? 'normal' : 'bold' })} />
                <FormatBtn icon={<Italic size={16}/>} active={currentStyles.fontStyle === 'italic'} onClick={() => updateStyle({ fontStyle: currentStyles.fontStyle === 'italic' ? 'normal' : 'italic' })} />
                <FormatBtn icon={<AlignLeft size={16}/>} active={currentStyles.textAlign === 'center'} onClick={() => updateStyle({ textAlign: currentStyles.textAlign === 'center' ? 'left' : 'center' })} />
              </div>
            </div>
          </StyleGroup>

          {/* GROUP 2: MARGINS */}
          {!isGlobal && (
            <StyleGroup title="Margins" icon={<Maximize size={14}/>} isOpen={activeGroup === "margins"} onToggle={() => setActiveGroup("margins")}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-2">
                <Slider label="Top" min="-40" max="100" unit="px" value={currentStyles.marginTop || "0px"} onChange={(v) => updateStyle({ marginTop: v })} />
                <Slider label="Bottom" min="-40" max="100" unit="px" value={currentStyles.marginBottom || "0px"} onChange={(v) => updateStyle({ marginBottom: v })} />
                <Slider label="Left" min="-40" max="100" unit="px" value={currentStyles.marginLeft || "0px"} onChange={(v) => updateStyle({ marginLeft: v })} />
                <Slider label="Right" min="-40" max="100" unit="px" value={currentStyles.marginRight || "0px"} onChange={(v) => updateStyle({ marginRight: v })} />
              </div>
            </StyleGroup>
          )}

          {/* GROUP 3: PADDING */}
          <StyleGroup title="Padding" icon={<Minimize size={14}/>} isOpen={activeGroup === "padding"} onToggle={() => setActiveGroup("padding")}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-2">
              <Slider label="Top" min="0" max="100" unit="px" value={currentStyles.paddingTop || "0px"} onChange={(v) => updateStyle({ paddingTop: v })} />
              <Slider label="Bottom" min="0" max="100" unit="px" value={currentStyles.paddingBottom || "0px"} onChange={(v) => updateStyle({ paddingBottom: v })} />
              <Slider label="Left" min="0" max="100" unit="px" value={currentStyles.paddingLeft || "0px"} onChange={(v) => updateStyle({ paddingLeft: v })} />
              <Slider label="Right" min="0" max="100" unit="px" value={currentStyles.paddingRight || "0px"} onChange={(v) => updateStyle({ paddingRight: v })} />
            </div>
          </StyleGroup>

          {/* GROUP 4: POSITIONING */}
          {!isGlobal && (
            <StyleGroup title="Positioning" icon={<Move size={14}/>} isOpen={activeGroup === "position"} onToggle={() => setActiveGroup("position")}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-2">
                <Slider label="Top Offset" min="-100" max="100" unit="px" value={currentStyles.top || "0px"} onChange={(v) => updateStyle({ top: v })} />
                <Slider label="Left Offset" min="-100" max="100" unit="px" value={currentStyles.left || "0px"} onChange={(v) => updateStyle({ left: v })} />
              </div>
            </StyleGroup>
          )}
        </div>
      )}
    </div>
  );
}

// --- Internal UI Components ---

function StyleGroup({ title, icon, children, isOpen, onToggle }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="text-slate-400">{icon}</div>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{title}</span>
        </div>
        <ChevronDown size={14} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-slate-50 animate-in fade-in slide-in-from-top-1">{children}</div>}
    </div>
  );
}

function Slider({ label, icon, min, max, unit, value, onChange, step = 1 }) {
  const numericVal = parseFloat(value) || 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
          {icon}{label}
        </span>
        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{value}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={numericVal} 
        onChange={(e) => onChange(`${e.target.value}${unit}`)}
        className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-blue-600 cursor-pointer" 
      />
    </div>
  );
}

function FormatBtn({ icon, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex-1 flex justify-center py-2 rounded-lg transition-all ${active ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
      {icon}
    </button>
  );
}