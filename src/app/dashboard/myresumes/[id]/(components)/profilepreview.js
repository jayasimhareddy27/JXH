"use client";
import React, { useRef, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux"; 


export default function ProfilePreview({extractionPhases, toggleAccordion, scrollToPreview }) {
   const { token, aiAgent: { agent, provider, apiKey }, profile: { formDataMap, loading }} = useSelector(
    (state) => ({  token: state.auth.token,  aiAgent: state.aiAgent,  profile: state.resumeEditor}),shallowEqual);
  
  const {sectionTitles} = formDataMap || {};
  const previewRefs = useRef({});

  useEffect(() => {
    if (scrollToPreview && previewRefs.current[scrollToPreview]) {
      const target = previewRefs.current[scrollToPreview];
      
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      target.classList.add("highlight-phase");
      setTimeout(() => target.classList.remove("highlight-phase"), 1500);
    }
  }, [scrollToPreview]); // The prop is the dependency
  

  return (
    <div className="md:col-span-5 bg-[color:var(--color-background-secondary)] rounded-xl shadow-lg 
      p-4 sm:p-6 lg:p-8  overflow-y-auto  max-h-[calc(100vh-160px)] md:max-h-[calc(115vh-200px)]  custom-scrollbar">
      <h2 className="text-2xl sm:text-3xl font-semibold text-[color:var(--color-text-primary)] mb-6 sm:mb-8 text-center">
        Profile Preview
      </h2>

      {extractionPhases.map((phase,index) => (
        <div key={phase.key} ref={(el) => (previewRefs.current[phase.key] = el)} onClick={() => toggleAccordion(phase.key)}
          className="mb-6 sm:mb-8 p-4 sm:p-6 border border-[color:var(--color-border-primary)]   rounded-xl sm:rounded-2xl   hover:shadow-lg transition-shadow cursor-pointer custom-preview-box"
          tabIndex={0} role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleAccordion(phase.key);
          }}
        >
          {sectionTitles && sectionTitles[index] && sectionTitles[index].title ? (
            <h3 className="text-xl sm:text-2xl font-bold text-[color:var(--color-button-primary-bg)] mb-3 sm:mb-5 select-none">
              {sectionTitles[index].title}
            </h3>
          ) : (
            <h3 className="text-xl sm:text-2xl font-bold text-[color:var(--color-button-primary-bg)] mb-3 sm:mb-5 select-none">
              {extractionPhases[index].title}
            </h3>
          )}
          <div className="text-[color:var(--color-text-secondary)] text-sm sm:text-base space-y-3 sm:space-y-4">
            {Array.isArray(formDataMap[phase.key]) ? (
              formDataMap[phase.key].length > 0 ? (
                formDataMap[phase.key].map((item, index) => (
                  <div key={index} className="p-3 sm:p-4 border border-[color:var(--color-border-secondary)] rounded-lg bg-[color:var(--color-background-primary)] shadow-sm hover:shadow-md transition-shadow custom-preview-box">
                              
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3">
                      {Object.entries(item).map(([fieldKey, fieldValue]) => (
                        <div key={fieldKey}>
                          <p className="font-semibold capitalize custom-label text-sm sm:text-base">{fieldKey.replace(/_/g, " ")}:</p>
                          <p className="mt-1 break-words">{fieldValue || <span className="italic text-gray-400">N/A</span>}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : ( <p className="italic text-gray-400">No data added yet</p> )
            ) : typeof formDataMap[phase.key] === "object" && formDataMap[phase.key] !== null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
                {Object.entries(formDataMap[phase.key]).map(([fieldKey, fieldValue]) => (
                  <div key={fieldKey}>
                    <p className="font-semibold capitalize custom-label text-sm sm:text-base">{fieldKey.replace(/_/g, " ")}:</p>
                    <p className="mt-1 break-words">{fieldValue || <span className="italic text-gray-400">N/A</span>}</p>
                  </div>
                ))}
              </div>
            ) : ( <p className="italic text-gray-400">No data available</p> )}
          </div>
        </div>
      ))}
    </div>
  );
}