"use client";
import React from "react";
import { extractionPhases } from "@components/prompts";

export default function ProfilePreview({ formDataMap, toggleAccordion }) {
  return (
    <div className="md:col-span-2 bg-[color:var(--color-background-secondary)] rounded-xl shadow-lg p-8 overflow-y-auto max-h-[calc(115vh-200px)] custom-scrollbar">
      <h2 className="text-3xl font-semibold text-[color:var(--color-text-primary)] mb-8 text-center">
        Profile Preview
      </h2>

      {extractionPhases.map((phase) => (
        <div
          key={phase.key}
          onClick={() => toggleAccordion(phase.key)}
          className="mb-8 p-6 border border-[color:var(--color-border-primary)] rounded-2xl hover:shadow-lg transition-shadow cursor-pointer custom-preview-box"
          tabIndex={0} // for keyboard accessibility
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleAccordion(phase.key);
          }}
        >
          <h3 className="text-2xl font-bold text-[color:var(--color-button-primary-bg)] mb-5 select-none">
            {phase.title}
          </h3>

          <div className="text-[color:var(--color-text-secondary)] text-base space-y-4">
            {Array.isArray(formDataMap[phase.key]) ? (
              formDataMap[phase.key].length > 0 ? (
                formDataMap[phase.key].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-[color:var(--color-border-secondary)] rounded-lg bg-[color:var(--color-background-primary)] shadow-sm hover:shadow-md transition-shadow custom-preview-box"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {Object.entries(item).map(([fieldKey, fieldValue]) => (
                        <div key={fieldKey}>
                          <p className="font-semibold capitalize custom-label">
                            {fieldKey.replace(/_/g, " ")}:
                          </p>
                          <p className="mt-1">{fieldValue || <span className="italic text-gray-400">N/A</span>}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="italic text-gray-400">No data added yet</p>
              )
            ) : typeof formDataMap[phase.key] === "object" &&
              formDataMap[phase.key] !== null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(formDataMap[phase.key]).map(([fieldKey, fieldValue]) => (
                  <div key={fieldKey}>
                    <p className="font-semibold capitalize custom-label">
                      {fieldKey.replace(/_/g, " ")}:
                    </p>
                    <p className="mt-1">{fieldValue || <span className="italic text-gray-400">N/A</span>}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-400">No data available</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
