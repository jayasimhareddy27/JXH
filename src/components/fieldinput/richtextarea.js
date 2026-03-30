"use client";

import React, { useEffect, useRef } from "react";

export default function RichTextarea({ value, label, onChange, disabled }) {
  const editorRef = useRef(null);

  // Keep the editor in sync with the data, but avoid cursor jumping
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (onChange) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const applyStyle = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-1 border border-b-0 rounded-t-lg bg-gray-50">
        <button 
          type="button"
          onClick={() => applyStyle("bold")} 
          className="px-3 py-1 hover:bg-gray-200 border rounded font-bold bg-white"
        >B</button>
        <button 
          type="button"
          onClick={() => applyStyle("italic")} 
          className="px-3 py-1 hover:bg-gray-200 border rounded italic bg-white"
        >I</button>
        <button 
          type="button"
          onClick={() => applyStyle("underline")} 
          className="px-3 py-1 hover:bg-gray-200 border rounded underline bg-white"
        >U</button>
        <button 
          type="button"
          onClick={() => applyStyle("insertUnorderedList")} 
          className="px-3 py-1 hover:bg-gray-200 border rounded bg-white"
        >• List</button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        className={`
          w-full p-3 rounded-b-lg border outline-none transition-all duration-200 text-sm min-h-[150px]
          bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500
          overflow-y-auto leading-relaxed block rich-text-content
        `}
      />
    </div>
  );
}