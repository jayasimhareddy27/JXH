"use client";
import { memo, useState } from "react";
import { showToast } from "./index";

// Reusable Accordion component
const Accordion = memo(({ title, isExpanded, onToggle, children }) => (
  <div className="border-b transition-all duration-300">
    <button
      onClick={onToggle}
      className={`w-full flex justify-between items-center px-4 py-3 text-left text-lg font-medium ${
        isExpanded ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
      }`}
    >
      <span dangerouslySetInnerHTML={{ __html: title }} />
      <span>{isExpanded ? "▲" : "▼"}</span>
    </button>
    {isExpanded && <div className="p-4 bg-gray-50 animate-fade-in">{children}</div>}
  </div>
));

// Reusable SectionTitle component
const SectionTitle = memo(({ phase, formData, title, setFormData, isLoading, renderField, setToastMessage, isArray }) => {
  const [titleInput, setTitleInput] = useState(title);

  const handleTitleBlur = () => {
    const currentTitle = isArray ? formData[0]?.sectionTitle : formData?.sectionTitle;
    if (titleInput !== currentTitle) {
      showToast(`Title updated for ${phase.title}`, setToastMessage, "success");
    }
  };

  const handleTitleChange = (updatedData) => {
    setTitleInput(updatedData.sectionTitle || phase.title);
    setFormData(phase.key, updatedData);
  };

  return (
    <div className="mb-4">
      <div onBlur={handleTitleBlur}>
        {renderField(
          ["sectionTitle", titleInput],
          isArray ? formData[0] || { sectionTitle: phase.title } : formData || { sectionTitle: phase.title },
          handleTitleChange,
          isArray ? 0 : null,
          isLoading
        )}
      </div>
    </div>
  );
});

// Reusable FieldList component
const FieldList = memo(({ phase, formData, setFormData, renderField, isLoading }) => {
  if (phase.arrayFieldKey) {
    return Array.isArray(formData) ? (
      formData.slice(1).map((item, idx) => (
        <div key={idx} className="border p-3 rounded-md bg-white shadow-sm relative">
          {Object.entries(item).map(([key, val]) =>
            renderField(
              [key, val],
              formData,
              (updated) => setFormData(phase.key, updated),
              idx + 1,
              isLoading
            )
          )}
          {formData.length > 2 && (
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
              onClick={() => setFormData(phase.key, formData.filter((_, i) => i !== idx + 1))}
            >
              ×
            </button>
          )}
        </div>
      ))
    ) : (
      <div className="text-red-500">Error: Invalid data format</div>
    );
  }
  return Object.entries(formData || {}).map(([key, val]) =>
    key !== "sectionTitle" ? (
      renderField(
        [key, val],
        formData,
        (updated) => setFormData(phase.key, updated),
        null,
        isLoading
      )
    ) : null
  );
});

// Reusable ActionButtons component
const ActionButtons = memo(({ phase, isLoading, handleFetchFromAI, handleReset, setFormData, formData }) => (
  <div className="space-y-4">
    {phase.arrayFieldKey && (
      <button
        type="button"
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
        onClick={() => {
          const newItem = Object.fromEntries(phase.fields.filter(f => f !== 'sectionTitle').map((f) => [f, ""]));
          setFormData(phase.key, [...formData, newItem]);
        }}
      >
        + Add {phase.title}
      </button>
    )}
    <div className="flex gap-4 pt-4">
      <button
        type="button"
        disabled={isLoading}
        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        onClick={() => handleFetchFromAI(phase)}
      >
        {isLoading ? "Fetching from AI..." : "Fetch from AI"}
      </button>
      <button
        type="button"
        className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        onClick={() => handleReset(phase, phase.key)}
      >
        Reset
      </button>
    </div>
  </div>
));

// Main PhaseAccordion component
function PhaseAccordion({ phase, formDataMap, setFormData, isLoading, handleFetchFromAI, handleReset, renderField, expandedPhase, toggleAccordion, setToastMessage }) {
  const title = Array.isArray(formDataMap[phase.key])
    ? formDataMap[phase.key][0]?.sectionTitle || phase.title
    : formDataMap[phase.key]?.sectionTitle || phase.title;

  return (
    <Accordion
      title={title}
      isExpanded={expandedPhase === phase.key}
      onToggle={() => toggleAccordion(phase.key)}
    >
      <SectionTitle
        phase={phase}
        formData={formDataMap[phase.key]}
        title={title}
        setFormData={setFormData}
        isLoading={isLoading}
        renderField={renderField}
        setToastMessage={setToastMessage}
        isArray={!!phase.arrayFieldKey}
      />
      <FieldList
        phase={phase}
        formData={formDataMap[phase.key]}
        setFormData={setFormData}
        renderField={renderField}
        isLoading={isLoading}
      />
      <ActionButtons
        phase={phase}
        isLoading={isLoading}
        handleFetchFromAI={handleFetchFromAI}
        handleReset={handleReset}
        setFormData={setFormData}
        formData={formDataMap[phase.key]}
      />
    </Accordion>
  );
}

export default memo(PhaseAccordion);