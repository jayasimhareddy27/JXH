"use client";
import { memo, useState } from "react"; // Added useState
import { useDispatch } from 'react-redux';
import { updatePhase, resetPhase, addPhaseItem, removePhaseItem } from '@lib/redux/features/editor/slice';

const Accordion = memo(({ title, isExpanded, onToggle, children, headerActions }) => (
  <div
    className={`rounded-xl mb-3 transition-all duration-300 overflow-hidden border
      ${isExpanded 
        ? "bg-[color:var(--color-card-bg)] border-[color:var(--color-button-primary-bg)]" 
        : "bg-white border-[color:var(--color-border-primary)] hover:border-gray-300"
      }`}
  >
    <div className={`flex items-center justify-between transition-colors ${isExpanded ? "bg-gray-50/50" : ""}`}>
      <button
        onClick={onToggle}
        className="flex-grow flex items-center justify-between px-4 py-3 text-left outline-none"
      >
        <span className={`text-[11px] uppercase tracking-widest font-black ${isExpanded ? "text-[var(--color-button-primary-bg)]" : "text-gray-400"}`}>
          {title}
        </span>
      </button>
      {headerActions}
    </div>
    {isExpanded && <div className="p-4 pt-0 animate-fade-in">{children}</div>}
  </div>
));

const FieldList = memo(({ phase, formDataMap, renderField, isLoading, selectedContainer }) => {
  const dispatch = useDispatch();
  const formData = formDataMap[phase.key] || phase.initial;
  const sectionTitles = formDataMap.sectionTitles || [];
  const displayTitle = phase.title;

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
    <div className="space-y-4">
      <div className="bg-gray-50/50 p-2 rounded-md border border-dashed border-gray-200">
        <p className="text-[9px] uppercase text-gray-400 mb-1 font-bold tracking-tighter">Display Title</p>
        {renderField(["title", displayTitle], { title: displayTitle }, onTitleChange, null, isLoading)}
      </div>

      {phase.arrayFieldKey ? (
        Array.isArray(formData) && (
          <div className="space-y-6">
            {formData.map((item, index) => {
              const isItemSelected = selectedContainer?.includes(`_${index}`);
              const entries = Object.entries(item).filter(([k]) => k !== "id");
              const dateFields = entries.filter(([k]) => k.toLowerCase().includes("date"));
              const otherFields = entries.filter(([k]) => !k.toLowerCase().includes("date"));

              const updateItem = (updatedItem) => {
                const newArray = [...formData];
                newArray[index] = updatedItem;
                dispatch(updatePhase({ phaseKey: phase.key, data: newArray }));
              };

              return (
                <div
                  key={item.id || index}
                  className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                    isItemSelected 
                      ? "border-[var(--color-button-primary-bg)] bg-blue-50/5 shadow-sm" 
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="absolute -left-2 top-4 bg-gray-100 text-[9px] px-1.5 py-0.5 rounded font-mono text-gray-400">
                    {index + 1}
                  </div>

                  <div className="space-y-3">
                    {otherFields.map(([key, val]) => (
                      <div 
                        className={`transition-all duration-200 rounded-md ${selectedContainer === `${key}_${index}` ? "ring-1 ring-[var(--color-button-primary-bg)] bg-white p-1" : ""}`} 
                        key={`${key}-${index}`}
                      >
                        {renderField([key, val], item, updateItem, index, isLoading)}
                      </div>
                    ))}

                    {dateFields.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {dateFields.map(([key, val]) => (
                          <div 
                            className={`transition-all duration-200 rounded-md ${selectedContainer === `${key}_${index}` ? "ring-1 ring-[var(--color-button-primary-bg)] bg-white p-1" : ""}`} 
                            key={`${key}-${index}`}
                          >
                            {renderField([key, val], item, updateItem, index, isLoading)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {formData.length > 1 && (
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-white border border-red-100 text-red-400 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
                      onClick={() => handleRemoveItem(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {Object.entries(formData || {}).map(([key, val]) => (
            <div 
              className={`transition-all duration-200 rounded-md ${selectedContainer === key ? "ring-1 ring-[var(--color-button-primary-bg)] bg-white p-1" : ""}`} 
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
          ))}
        </div>
      )}
    </div>
  );
});

function PhaseAccordion({ phase, formDataMap, isLoading, renderField, expandedPhase, toggleAccordion, handleFetchFromAI, phaseindex, selectedContainer }) {
  const dispatch = useDispatch();
  
  // Local loading to trigger spinner immediately upon click
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const titles = formDataMap?.sectionTitles || [];
  const displayTitle = titles[phaseindex]?.title || phase.title;

  const handleAddItem = (e) => {
    e.stopPropagation();
    const newItem = { ...Object.fromEntries(phase.fields.map(f => [f, ""])), id: `item-${Date.now()}` };
    dispatch(addPhaseItem({ phaseKey: phase.key, newItem }));
    if (expandedPhase !== phase.key) toggleAccordion(phase.key);
  };

  const handleAI = async (e) => {
    e.stopPropagation();
    setIsLocalLoading(true); // Start local spinner
    try {
      await handleFetchFromAI(phase);
    } catch (err) {
      console.error("AI Fetch Error:", err);
    } finally {
      setIsLocalLoading(false); // Stop local spinner
    }
  };

  const headerActions = (
    <div className="flex items-center gap-2 mr-2">
      <button
        onClick={handleAI}
        disabled={isLoading || isLocalLoading}
        className="relative flex items-center justify-center w-8 h-8 text-[var(--color-button-primary-bg)] hover:bg-blue-50 rounded-full transition-all disabled:opacity-50"
        title="AI Enhance"
      >
        {/* Spinner triggers if either Global or Local loading is true */}
        {(isLoading || isLocalLoading) ? (
          <div className="w-4 h-4 border-2 border-[var(--color-button-primary-bg)] border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-sm">✨</span>
        )}
      </button>

      {phase.arrayFieldKey && (
        <button
          onClick={handleAddItem}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter border border-gray-200 text-gray-400 hover:text-[var(--color-button-primary-bg)] hover:border-[var(--color-button-primary-bg)] rounded transition-all"
        >
          <span>+</span> Add
        </button>
      )}
    </div>
  );

  return (
    <Accordion 
      title={displayTitle} 
      isExpanded={expandedPhase === phase.key} 
      onToggle={() => toggleAccordion(phase.key)}
      headerActions={headerActions}
    >
      <FieldList 
        phase={phase} 
        formDataMap={formDataMap} 
        renderField={renderField} 
        isLoading={isLoading || isLocalLoading} 
        selectedContainer={selectedContainer}
      />
      
      <div className="mt-4 pt-2 border-t border-gray-50 flex justify-end">
        <button 
          className="text-[10px] font-bold uppercase text-gray-300 hover:text-red-400 transition-colors"
          onClick={() => {
            if(window.confirm("Reset this section?")) dispatch(resetPhase(phase.key));
          }}
        >
          Reset Section
        </button>
      </div>
    </Accordion>
  );
}

export default memo(PhaseAccordion);