"use client";
import { memo } from "react";
import { useDispatch } from 'react-redux';
import { updateFormData, resetPhase } from '@lib/redux/features/profileslice';
import { displayToast } from '@lib/redux/features/toastslice';

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
      <span className="text-sm">
        {isExpanded ? "▲" : "▼"}
      </span>
    </button>

    {isExpanded && (
      <div className="p-4 animate-fade-in">
        {children}
      </div>
    )}
  </div>
));

const FieldList = memo(({ phase, formDataMap, renderField, isLoading }) => {
    const dispatch = useDispatch();

    const sectionTitles = formDataMap.sectionTitles || [];
    const currentSection = sectionTitles.find(st => st.key === phase.key);
    const displayTitle = currentSection ? currentSection.title : phase.title;

    const onTitleChange = (updatedValue) => {
        const newTitle = updatedValue.title;
        const existingTitleIndex = sectionTitles.findIndex(st => st.key === phase.key);
        let updatedTitles = [...sectionTitles];
        if (existingTitleIndex !== -1) {
            updatedTitles[existingTitleIndex] = { ...updatedTitles[existingTitleIndex], title: newTitle };
        } else {
            updatedTitles.push({ key: phase.key, title: newTitle });
        }
        dispatch(updateFormData({ phaseKey: 'sectionTitles', data: updatedTitles }));
    };

    const formData = formDataMap[phase.key] || phase.initial;

    const handleRemoveItem = (itemIndex) => {
        const updatedData = formData.filter((_, i) => i !== itemIndex);
        dispatch(updateFormData({ phaseKey: phase.key, data: updatedData }));
    };

    return (
        <>
            <div className="mb-4">
                {renderField(["title", displayTitle], { title: displayTitle }, onTitleChange, null, isLoading)}
            </div>
            <hr className="border-[color:var(--color-border)] mb-4" />
            
            {phase.arrayFieldKey ? (
                Array.isArray(formData) ? formData.map((item, index) => (
                    <div key={item.id || index} className="border p-3 rounded-md bg-white shadow-sm relative mb-4 dark:bg-[color:var(--color-card-bg)]">
                        {Object.entries(item).filter(([key]) => key !== 'id').map(([key, val]) => {
                            const updateArrayWithItem = (updatedItemObject) => {
                                const fullUpdatedArray = [...formData];
                                fullUpdatedArray[index] = updatedItemObject;
                                dispatch(updateFormData({ phaseKey: phase.key, data: fullUpdatedArray }));
                            };
                            return renderField([key, val], item, updateArrayWithItem, index, isLoading);
                        })}
                        {formData.length >= 1 && (
                            <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold" onClick={() => handleRemoveItem(index)} aria-label="Remove item">×</button>
                        )}
                    </div>
                )) : <div className="text-red-600 font-semibold">Error: Invalid data format for this section.</div>
            ) : (
                Object.entries(formData || {}).map(([key, val]) =>
                    renderField([key, val], formData, (updatedData) => dispatch(updateFormData({ phaseKey: phase.key, data: updatedData })), null, isLoading)
                )
            )}
        </>
    );
});

const ActionButtons = memo(({ phase, formData, isLoading, handleFetchFromAI, displayTitle }) => {
    const dispatch = useDispatch();

    const handleAddItem = () => {
        const newItem = {
            ...Object.fromEntries(phase.fields.map((field) => [field, ""])),
            id: `item-${Date.now()}`
        };
        const updatedData = Array.isArray(formData) ? [...formData, newItem] : [newItem];
        dispatch(updateFormData({ phaseKey: phase.key, data: updatedData }));
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

function PhaseAccordion({ phase, formDataMap, isLoading, renderField, expandedPhase, toggleAccordion, handleFetchFromAI }) {
    const sectionTitles = formDataMap.sectionTitles || [];
    const currentSection = sectionTitles.find(st => st.key === phase.key);
    const displayTitle = currentSection ? currentSection.title : phase.title;

    return (
        <Accordion title={displayTitle} isExpanded={expandedPhase === phase.key} onToggle={() => toggleAccordion(phase.key)}>
            <FieldList phase={phase} formDataMap={formDataMap} renderField={renderField} isLoading={isLoading}/>
            <ActionButtons phase={phase} formData={formDataMap[phase.key] || phase.initial} isLoading={isLoading} handleFetchFromAI={handleFetchFromAI} displayTitle={displayTitle}/>
        </Accordion>
    );
}

export default memo(PhaseAccordion);