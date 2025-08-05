"use client";
import React from "react";
import { extractionPhases } from "@components/prompts";

export default function ProfilePreview({ formDataMap, toggleAccordion }) {
  return (
    <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[calc(115vh-200px)] custom-scrollbar">
      <h2 className="text-3xl font-semibold text-[color:var(--color-headline)] mb-8 text-center">
        Profile Preview
      </h2>

      {extractionPhases.map((phase) => (
        <div
          key={phase.key}
          onClick={() => toggleAccordion(phase.key)}
          className="mb-8 p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h3 className="text-2xl font-bold text-[color:var(--color-button-bg)] mb-5 select-none">
            {phase.title}
          </h3>

          <div className="text-[color:var(--color-paragraph)] text-base space-y-4">
            {Array.isArray(formDataMap[phase.key]) ? (
              formDataMap[phase.key].length > 0 ? (
                formDataMap[phase.key].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 rounded-lg bg-[color:var(--color-background)] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {Object.entries(item).map(([fieldKey, fieldValue]) => (
                        <div key={fieldKey}>
                          <p className="font-semibold capitalize text-[color:var(--color-headline)]">
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
                    <p className="font-semibold capitalize text-[color:var(--color-headline)]">
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-button-bg);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-background);
        }
        /* For smooth color transitions */
        div:hover {
          transition: box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  );
}
