"use client";

import { memo, useRef, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { extractionPhases } from "@public/staticfiles/prompts/index";
import { updateResumePhase } from "@lib/redux/features/resumes/resumeeditor/slice";
import { EyeOff, AlertCircle, Sparkles } from "lucide-react";
import renderField from "@/app/dashboard/myresumes/[id]/(components)/renderfields";
import PhaseAccordion from "@/app/dashboard/myresumes/[id]/(components)/phaseaccordion";


const DetailsTab = memo(({ expandedPhase, toggleAccordion, handleFetchFromAI, handleSave }) => {
  const dispatch = useDispatch();
  const phaseRefs = useRef({});

  const { formDataMap, loading } = useSelector(
    (state) => state.resumeEditor,
    shallowEqual
  );

  const designConfig = formDataMap?.designConfig || {};
  const visibility = designConfig.visibility || {};
  const isLoading = loading === "loading";

  // --- Hidden Sections Summary ---
  const hiddenSections = extractionPhases.filter(p => visibility[p.key] === false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Visibility Alert: Shows if any sections are currently hidden */}
      {hiddenSections.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-600 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-amber-900 uppercase">Hidden Content</p>
            <p className="text-[9px] text-amber-700 leading-tight">
              {hiddenSections.length} sections are currently hidden from your resume preview.
            </p>
          </div>
        </div>
      )}

      {/* 2. Content Sections (Accordions) */}
      <div className="space-y-3">
        {extractionPhases.map((phase, index) => {
          const isSectionHidden = visibility[phase.key] === false;
          
          return (
            <div 
              key={phase.key} 
              ref={(el) => (phaseRefs.current[phase.key] = el)}
              className={isSectionHidden ? "opacity-75" : ""}
            >
              {/* Added a custom badge inside PhaseAccordion if hidden */}
              <div className="relative">
                {isSectionHidden && (
                  <div className="absolute -top-2 -right-2 z-10 bg-[var(--color-background-tertiary)] border border-[var(--color-border-primary)] rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
                    <EyeOff size={10} className="text-[var(--color-text-placeholder)]" />
                    <span className="text-[8px] font-black uppercase text-[var(--color-text-placeholder)]">Hidden</span>
                  </div>
                )}
                
                <PhaseAccordion 
                  phase={phase} 
                  expandedPhase={expandedPhase} 
                  isLoading={isLoading} 
                  formDataMap={formDataMap}
                  toggleAccordion={toggleAccordion} 
                  handleFetchFromAI={handleFetchFromAI} 
                  renderField={renderField} 
                  phaseindex={index}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Global Action Footer */}
      <div className="pt-4 border-t border-[var(--color-border-primary)] space-y-3">
        
        <p className="text-[9px] text-center text-[var(--color-text-placeholder)] font-medium italic">
          Tip: Use "Fetch from AI" inside sections to auto-fill details.
        </p>
      </div>
    </div>
  );
});

export default DetailsTab;