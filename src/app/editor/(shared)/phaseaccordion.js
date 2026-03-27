"use client";
import { memo } from "react";
import { useDispatch } from 'react-redux';
import { updatePhase, resetPhase, addPhaseItem, removePhaseItem } from '@lib/redux/features/editor/slice';
import { displayToast } from '@lib/redux/features/toast/thunks';

const Accordion = memo(({ title, isExpanded, onToggle, children }) => (
  <div
    className={`rounded-lg mb-3 shadow-sm transition-all duration-300 overflow-hidden
      ${isExpanded 
        ? "bg-[color:var(--color-card-bg)] border-2 border-[color:var(--color-button-primary-bg)] shadow-lg" 
        : "bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-primary)] hover:shadow-md"
      }`}
  >
    <button
      onClick={onToggle}
      className={`w-full flex justify-between items-center p-1 text-left text-md font-medium transition-colors duration-200
        ${isExpanded 
          ? "text-[color:var(--color-text-primary)] bg-[color:var(--color-background-tertiary)]" 
          : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-card-hover-bg)]"
        }`}
    >
      <span>{title}</span>
      <span className="text-sm">{isExpanded ? "▲" : "▼"}</span>
    </button>
    {isExpanded && <div className="p-4 animate-fade-in">{children}</div>}
  </div>
));

const FieldList = memo(({ phase, formDataMap, renderField, isLoading,selectedContainer}) => {
  const dispatch = useDispatch();

  const formData = formDataMap[phase.key] || phase.initial;

  const sectionTitles = formDataMap.sectionTitles || [];
  const currentSection = sectionTitles.find(st => st.key === phase.key);
  const displayTitle = phase.title;
console.log(currentSection);


  const handleRemoveItem = (index) => {
    dispatch(removePhaseItem({ phaseKey: phase.key, index }));
  };

  const onTitleChange = (updatedValue) => {
      const newTitle = updatedValue.title;
      
      const existingTitleIndex = sectionTitles.findIndex(st => st.key === phase.key);
      let updatedTitles = [...sectionTitles];
      
      if (existingTitleIndex !== -1) {
          updatedTitles[existingTitleIndex] = { ...updatedTitles[existingTitleIndex], title: newTitle };
      } else {
          updatedTitles.push({ key: phase.key, title: newTitle });
      }
      
      dispatch(updatePhase({ phaseKey: 'sectionTitles', data: updatedTitles }));
  };

  return (
    <>
      <div className="mb-4">
          {renderField(["title", displayTitle], displayTitle , onTitleChange, null, isLoading)}
      </div>
      <hr className="border-[color:var(--color-border)] mb-4" />
            
{phase.arrayFieldKey ? (
  Array.isArray(formData) ? (
    formData.map((item, index) => {
      // Logic to check if the specific block (e.g., job_0) is selected
      const isItemSelected = selectedContainer?.includes(`_${index}`);

      return (
        <div
          key={item.id || index}
          className={`border p-3 rounded-md bg-white shadow-sm relative mb-4 dark:bg-[color:var(--color-card-bg)] transition-all duration-300 ${
            isItemSelected ? "ring-2 ring-[var(--color-button-primary-bg)] border-transparent shadow-md" : ""
          }`}
        >
          {Object.entries(item)
            .filter(([k]) => k !== "id")
            .map(([key, val]) => {
              const updateItem = (updatedItem) => {
                const newArray = [...formData];
                newArray[index] = updatedItem;
                dispatch(updatePhase({ phaseKey: phase.key, data: newArray }));
              };

              // Logic to check if specific field (e.g., jobTitle_0) is selected
              const isFieldSelected = selectedContainer === `${key}_${index}`;

              // CRITICAL FIX: Added 'return' here
              return (
                <div 
                  className={`transition-colors duration-200 ${isFieldSelected ? "bg-blue-50 rounded p-1 -m-1 ring-1 ring-blue-100" : ""}`} 
                  key={`${key}-${index}`}
                >
                  {renderField([key, val], item, updateItem, index, isLoading)}
                </div>
              );
            })}
          
          {formData.length >= 1 && (
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold z-10"
              onClick={() => handleRemoveItem(index)}
            >
              ×
            </button>
          )}
        </div>
      );
    })
  ) : (
    <div className="text-red-600 font-semibold">Error: Invalid data format for this section.</div>
  )
) : (
  /* Handling for non-array fields (like Career Summary) */
  Object.entries(formData || {}).map(([key, val]) => (
    <div 
      className={`transition-colors duration-200 ${selectedContainer === key ? "bg-blue-50 rounded p-1 -m-1 ring-1 ring-blue-100" : ""}`} 
      key={key}
    >
      {renderField(
        [key, val], 
        formData, 
        (updatedData) => dispatch(updatePhase({ phaseKey: phase.key, data: updatedData })), 
        null, 
        isLoading
      )}
    </div>
  ))
)}
    </>
  );
});

const ActionButtons = memo(({ phase, formData, isLoading, handleFetchFromAI }) => {
  const dispatch = useDispatch();
  const displayTitle = phase.title;

  const handleAddItem = () => {
    const newItem = { ...Object.fromEntries(phase.fields.map(f => [f, ""])), id: `item-${Date.now()}` };
    dispatch(addPhaseItem({ phaseKey: phase.key, newItem }));
  };

  const handleReset = () => {
    dispatch(resetPhase(phase.key));
    dispatch(displayToast({ message: `${displayTitle} reset successfully`, type: "success" }));
  };

  return (
    <div className="space-y-4 pt-4">
      {phase.arrayFieldKey && (
        <button type="button" className="px-3 py-1 bg-[color:var(--color-button-primary-bg)] text-white rounded hover:bg-[color:var(--color-button-primary-hover-bg)] transition-colors font-semibold" onClick={handleAddItem}>
          + Add {displayTitle}
        </button>
      )}
      <div className="flex gap-4">
        <button type="button" disabled={isLoading} className="flex-1 px-4 py-2 bg-[color:var(--color-cta-bg)] text-[color:var(--color-cta-text)] rounded hover:bg-[color:var(--color-cta-hover-bg)] disabled:opacity-50 transition-colors font-semibold" onClick={() => handleFetchFromAI(phase)}>
          {isLoading ? "Fetching..." : "Fetch from AI"}
        </button>
        <button type="button" className="flex-1 px-4 py-2 bg-[color:var(--color-danger)] text-white rounded hover:bg-[color:var(--color-danger-hover)] transition-colors font-semibold" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
});

function PhaseAccordion({ phase, formDataMap, isLoading, renderField, expandedPhase, toggleAccordion, handleFetchFromAI,phaseindex,selectedContainer }) {
  const titles=formDataMap?.sectionTitles||[];
  const displayTitle =titles[phaseindex]?.title || phase.title;
    console.log(formDataMap);
    
  return (
    <Accordion title={displayTitle} isExpanded={expandedPhase === phase.key} onToggle={() => toggleAccordion(phase.key)}>
      <FieldList phase={phase} formDataMap={formDataMap} renderField={renderField} isLoading={isLoading} selectedContainer={selectedContainer}/>
      <ActionButtons phase={phase} formData={formDataMap[phase.key] || phase.initial} isLoading={isLoading} handleFetchFromAI={handleFetchFromAI}/>
    </Accordion>
  );
}

export default memo(PhaseAccordion);