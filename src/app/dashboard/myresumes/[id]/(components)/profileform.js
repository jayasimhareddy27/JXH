"use client";
import { memo, useRef, useEffect } from "react";
import PhaseAccordion from "./phaseaccordion";

const ProfileForm = memo(({phases,expandedPhase,isLoading,formDataMap = {},toggleAccordion,handleFetchFromAI,renderField,handleSave,scrollToPhase}) => {
  const phaseRefs = useRef({});

  // Scroll to a phase if requested
  useEffect(() => {
    if (scrollToPhase && phaseRefs.current[scrollToPhase]) {
      const target = phaseRefs.current[scrollToPhase];
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("highlight-phase");
      setTimeout(() => target.classList.remove("highlight-phase"), 1500);
    }
  }, [scrollToPhase]);

  const btnClasses =
    "m-1 w-full px-4 py-2 bg-[color:var(--color-button-primary-bg)] " +
    "text-[color:var(--color-text-on-primary)] rounded-lg " +
    "hover:bg-[color:var(--color-button-primary-hover-bg)] " +
    "transition-colors duration-200 disabled:opacity-50";

  const renderLoader = () => (
    <div className="flex justify-center my-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[color:var(--color-button-primary-bg)]"></div>
    </div>
  );
  

  return (
    <div className="md:col-span-2 p-2 w-full max-w-md bg-[color:var(--color-background-secondary)] rounded-xl shadow-lg overflow-y-auto max-h-[calc(115vh-200px)] custom-scrollbar">
      
      {isLoading && renderLoader()}

      {phases.map((phase,index) => (
        <div key={phase.key} ref={(el) => (phaseRefs.current[phase.key] = el)}>
          <PhaseAccordion phase={phase} expandedPhase={expandedPhase} isLoading={isLoading} formDataMap={formDataMap}
            toggleAccordion={toggleAccordion}   handleFetchFromAI={handleFetchFromAI}  renderField={renderField} phaseindex={index}/>
        </div>
      ))}
      <button  disabled={isLoading}  onClick={handleSave}  type="button" className={btnClasses}>  {isLoading ? "Saving..." : "Save All Changes"}</button>
    </div>
  );
});

export default ProfileForm;
