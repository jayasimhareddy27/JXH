"use client";

import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { saveResumeById } from "@lib/redux/features/resumes/resumeeditor/thunks";
import { updateResumePhase } from "@lib/redux/features/resumes/resumeeditor/slice";
import { layouts, fontSizes, colors, spacing, layoutGrid } from "./constants";

export default function ResumeDesignEditor({ resumeId, selectedContainer }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { formDataMap } = useSelector(
    (state) => state.resumeEditor,
    shallowEqual
  );

  if (!formDataMap?.designConfig) return null;
  const { designConfig } = formDataMap;

  // --- Update layout ---
  const setLayout = (layoutId) => {
    dispatch(
      updateResumePhase({
        phaseKey: "designConfig",
        data: { ...designConfig, layout: layoutId },
      })
    );
  };

  // --- Apply inline style to a container ---
  const updateContainerStyle = (containerId, newStyle) => {
    const prevStyle = designConfig.containers?.[containerId]?.style || {};
    const mergedStyle = { ...prevStyle, ...newStyle };

    dispatch(
      updateResumePhase({
        phaseKey: "designConfig",
        data: {
          ...designConfig,
          containers: {
            ...designConfig.containers,
            [containerId]: { style: mergedStyle },
          },
        },
      })
    );
  };

  const applyStyle = (styleObj) => {
    if (!selectedContainer) return;
    updateContainerStyle(selectedContainer, styleObj);
  };

  // --- Save designConfig ---
  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(saveResumeById({ resumeId })).unwrap();
    } catch (err) {
      console.error("Failed to save designConfig:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex h-full flex-col justify-between bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
  {/* TOP */}
  <div className="space-y-8 overflow-y-auto p-4">
    {/* PAGE STRUCTURE */}
    <div className="space-y-3">
      <div className="text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase">
        Page Structure
      </div>

      <div className="grid grid-cols-2 gap-3">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => setLayout(layout.id)}
            className={`
              rounded-md p-3 text-left transition-all duration-200 bg-[var(--color-background-secondary)] border
              ${designConfig.layout === layout.id 
                ? "border-[var(--color-text-primary)] ring-2 ring-[var(--color-text-primary)]" 
                : "border-[var(--color-border-primary)] shadow-none"}
            `}
          >
            <div className="font-medium">{layout.label}</div>
          </button>
        ))}
      </div>
    </div>

    {/* SECTION STYLES */}
    <div className="space-y-6">
      <div className="text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase">
        Section Styles
      </div>

      {!selectedContainer ? (
        <div className="rounded-md border border-[var(--color-border-primary)] bg-[var(--color-background-tertiary)] p-3 text-[12px] text-[var(--color-text-placeholder)]">
          Click any section in the resume preview to customize its styles.
        </div>
      ) : (
        <>
          {/* FONT SIZE */}
          <div className="mb-3">
            <div className="font-medium">Font Size — {selectedContainer}</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => applyStyle({ fontSize: size.value })}
                  className="rounded-md border border-[var(--color-border-primary)] bg-[var(--color-button-secondary-bg)] px-2 py-1 text-[var(--color-text-primary)] cursor-pointer"
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* TEXT COLOR */}
          <div className="mb-3">
            <div className="font-medium">Text Color</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => applyStyle({ color: color.value })}
                  style={{ color: color.value }} // Kept inline style because the color value is dynamic data
                  className="rounded-md border border-[var(--color-border-primary)] bg-[var(--color-button-secondary-bg)] px-2 py-1 cursor-pointer"
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          {/* SPACING */}
          <div className="mb-3">
            <div className="font-medium">Spacing</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {spacing.map((sp) => (
                <button
                  key={sp.value}
                  onClick={() => applyStyle({ marginTop: sp.value })}
                  className="rounded-md border border-[var(--color-border-primary)] bg-[var(--color-button-secondary-bg)] px-2 py-1 text-[var(--color-text-primary)] cursor-pointer"
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  </div>

  {/* SAVE */}
  <div className="border-t border-[var(--color-border-primary)] p-4">
    <button
      onClick={handleSave}
      disabled={loading}
      className={`
        w-full rounded-md p-3 font-medium transition-opacity bg-[var(--color-button-primary-bg)] text-[var(--color-cta-text)]
        ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer opacity-100"}
      `}
    >
      {loading ? "Saving..." : "Save Layout & Styles"}
    </button>
  </div>
</div>
  );
}
