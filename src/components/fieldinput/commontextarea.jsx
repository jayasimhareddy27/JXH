"use client";

import React, { useState, useEffect, useRef } from "react";

export default function CommonTextarea({ value, label, disabled, onChange }) {
  const [text, setText] = useState(value || "");
  const textareaRef = useRef(null);


  useEffect(() => {
    setText(value || "");
  }, [value]);

  // Adjust height on initial render and when text changes

  const handleChange = (e) => {
    const newValue = e.target.value;
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        disabled={disabled}
        placeholder={`Enter ${label?.toLowerCase()}...`}
        rows={1} // Start small and grow
        className={`
           w-full p-3 rounded-lg border outline-none transition-all duration-200 text-sm
          bg-[var(--color-background-secondary)] 
          text-[var(--color-text-primary)] 
          border-[var(--color-border-primary)]
          placeholder:text-[var(--color-text-placeholder)]
          focus:ring-2 focus:ring-[var(--color-button-primary-bg)] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          overflow-hidden resize-none leading-relaxed block
        `}
      />
    </div>
  );
}