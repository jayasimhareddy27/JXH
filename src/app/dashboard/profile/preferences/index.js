"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Section = ({ title, icon, children }) => (
  <div className="p-8 shadow-modal transition-all duration-300 border-2 border-transparent hover:border-[color:var(--color-border-primary)] bg-[color:var(--color-card-bg)] rounded-[24px]">
    <div className="flex items-center gap-3 mb-6 font-black italic text-[color:var(--color-button-primary-bg)]">
      <div className="p-2 rounded-xl bg-[color:var(--color-background-tertiary)]">{icon}</div>
      <h2 className="text-[11px] uppercase tracking-[0.2em]">{title}</h2>
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

export const Select = ({ label, value, children, noLabel, ...props }) => (
  <div className="w-full">
    {!noLabel && <label className="block text-[10px] font-black uppercase opacity-50 mb-1.5 ml-1">{label}</label>}
    <select 
      {...props} 
      value={value ?? ""} 
      onChange={e => props.onChange(e.target.value)} 
      className="w-full p-4 rounded-2xl border-2 border-transparent outline-none font-bold text-sm transition-all appearance-none cursor-pointer bg-[color:var(--color-background-tertiary)] text-[color:var(--color-text-primary)]"
    >
      {children}
    </select>
  </div>
);

export const Input = ({ label, value, icon, ...props }) => (
    <div className="w-full">
      <label className="block text-[10px] font-black uppercase opacity-50 mb-1.5 ml-1">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-4 opacity-50 text-[color:var(--color-text-secondary)]">{icon}</div>}
        <input 
          {...props} 
          value={value ?? ""} 
          onChange={e => props.onChange(e.target.value)} 
          className={`w-full p-4 rounded-2xl border-2 border-transparent outline-none font-bold text-sm transition-all bg-[color:var(--color-background-tertiary)] text-[color:var(--color-text-primary)] ${icon ? 'pl-10' : ''}`} 
        />
      </div>
    </div>
);

export const Toggle = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center p-4 rounded-2xl transition-all bg-[color:var(--color-background-tertiary)]">
    {/* Question Label */}
    <span className="text-[11px] font-black uppercase opacity-80 leading-tight pr-4">
      {label}
    </span>

    {/* Y / N Buttons */}
    <div className="flex gap-1 shrink-0">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all flex items-center justify-center border-2 ${
          checked 
          ? 'bg-green-600 text-white border-transparent shadow-lg scale-105' 
          : 'bg-[color:var(--color-background-secondary)] text-[color:var(--color-text-secondary)] border-[color:var(--color-border-primary)] opacity-40 hover:opacity-100'
        }`}
      >
        Y
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all flex items-center justify-center border-2 ${
          !checked 
          ? 'bg-red-600 text-white border-transparent shadow-lg scale-105' 
          : 'bg-[color:var(--color-background-secondary)] text-[color:var(--color-text-secondary)] border-[color:var(--color-border-primary)] opacity-40 hover:opacity-100'
        }`}
      >
        N
      </button>
    </div>
  </div>
);
export const TagInput = ({ label, tags, onUpdate, placeholder }) => {
  const [val, setVal] = useState("");
  const addTag = (e) => {
    if (e.key === 'Enter' && val.trim()) {
      onUpdate([...(tags || []), val.trim()]);
      setVal("");
    }
  };
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase opacity-50 ml-1">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-2xl border-2 border-transparent min-h-[50px] bg-[color:var(--color-background-tertiary)]">
        {tags?.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-lg bg-[color:var(--color-button-primary-bg)] text-[color:var(--color-text-inverse)]">
            {tag} <X size={10} className="cursor-pointer" onClick={() => onUpdate(tags.filter((_, idx) => idx !== i))} />
          </span>
        ))}
        <input 
          className="bg-transparent outline-none text-xs font-bold flex-1 min-w-[80px]" 
          placeholder={!tags || tags.length === 0 ? placeholder : ""} 
          value={val} 
          onChange={(e) => setVal(e.target.value)} 
          onKeyDown={addTag} 
        />
      </div>
    </div>
  );
};