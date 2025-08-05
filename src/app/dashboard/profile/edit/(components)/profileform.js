import { memo, useRef, useEffect } from "react";
import PhaseAccordion from "./phaseaccordion";

const ProfileForm = memo(({
  phases,
  expandedPhase,
  isLoading,
  formDataMap,
  setFormData,
  toggleAccordion,
  handleFetchFromAI,
  handleReset,
  renderField,
  setToastMessage,
  handleSave,
  scrollToPhase
}) => {
  const phaseRefs = useRef({});

  useEffect(() => {
    if (scrollToPhase && phaseRefs.current[scrollToPhase]) {
      const target = phaseRefs.current[scrollToPhase];
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("highlight-phase");
      setTimeout(() => target.classList.remove("highlight-phase"), 1500);
    }
  }, [scrollToPhase]);

  return (
    <div className="w-full max-w-md bg-[color:var(--color-background-secondary)] rounded-xl shadow-lg p-6 overflow-y-auto max-h-[calc(115vh-200px)] custom-scrollbar">
      <div>
        <button
          type="button"
          className="m-1 w-full px-4 py-2 bg-[color:var(--color-button-primary-bg)] text-[color:var(--color-text-on-primary)] rounded-lg hover:bg-[color:var(--color-button-primary-hover-bg)] transition-colors duration-200 disabled:opacity-50"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save All Changes"}
        </button>
      </div>
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[color:var(--color-button-primary-bg)]"></div>
        </div>
      )}
      
      {phases.map((phase) => (
        <div
          key={phase.key}
          ref={(el) => (phaseRefs.current[phase.key] = el)}
        >
          <PhaseAccordion
            phase={phase}
            expandedPhase={expandedPhase}
            isLoading={isLoading}
            formDataMap={formDataMap}
            setFormData={setFormData}
            toggleAccordion={toggleAccordion}
            handleFetchFromAI={handleFetchFromAI}
            handleReset={handleReset}
            renderField={renderField}
            setToastMessage={setToastMessage}
          />
        </div>
      ))}

      <style jsx>{`
        .highlight-phase {
          outline: 3px solid var(--color-button-primary-bg);
          border-radius: 8px;
          transition: outline 0.3s ease-in-out;
        }
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-background-tertiary);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--color-button-primary-bg);
          border-radius: 8px;
          border: 2px solid var(--color-background-secondary);
        }
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-button-primary-bg) var(--color-background-tertiary);
        }
      `}</style>
    </div>
  );
});

export default ProfileForm;
