"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateResumePhase } from "@lib/redux/features/resumes/resumeeditor/slice";
import { templates } from "@resumetemplates/templatelist";

export default function SelectTemplateTab() {
  const dispatch = useDispatch();
  const currentTemplateId = useSelector((state) => state.resumeEditor.formDataMap?.templateId);

  const handleTemplateChange = (id) => {
    dispatch(updateResumePhase({
      phaseKey: "templateId",
      data: id,
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">
        Choose a Template
      </div>
      <div className="grid grid-cols-1 gap-4">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTemplateChange(t.id)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all ${
              currentTemplateId === t.id 
              ? "border-[var(--color-button-primary-bg)] ring-4 ring-[var(--color-button-primary-bg)]/10" 
              : "border-[var(--color-border-primary)] hover:border-[var(--color-text-secondary)]"
            }`}
          >
            <div className="aspect-[3/4] bg-[var(--color-background-tertiary)] flex items-center justify-center">
               <span className="text-[10px] font-bold text-[var(--color-text-placeholder)]">Preview of {t.name}</span>
            </div>
            <div className="p-3 bg-white border-t border-[var(--color-border-primary)] text-center text-xs font-bold uppercase">
              {t.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}