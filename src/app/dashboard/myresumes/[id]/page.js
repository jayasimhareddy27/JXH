"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useParams } from "next/navigation";

import { fetchResumeById, saveResumeById, fetchAIdata_resume } from "@lib/redux/features/resumeslice";
import { resumeextractionPhases } from "@components/prompts";
import renderField from "./(components)/renderfields";
import ProfileForm from "./(components)/profileform";
import ProfilePreview from "./(components)/profilepreview";

export default function NewResume() {
  const dispatch = useDispatch();
  const params = useParams();
  const resumeId = params?.id;

  const { token, aiAgent: { agent, provider, apiKey }, profile: { formDataMap, loading }} = useSelector(
    (state) => ({  token: state.auth.token,  aiAgent: state.aiAgent,  profile: state.resumes}),shallowEqual);
  
  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [lastActionOrigin, setLastActionOrigin] = useState(null);

  const isLoading = loading === "loading";

  useEffect(() => {
    if (!token || !resumeId) return;
    console.log("FETCHING RESUME BY ID");
    
    dispatch(fetchResumeById(resumeId));
  }, [token, resumeId, dispatch]);

  
  const handleFetchFromAI = useCallback(
    async (phase) => {
      const text = localStorage.getItem("resumeRawText");
      if (!text) return alert("No resume text found. Please upload your resume first.");

      try {
        await dispatch( fetchAIdata_resume({phase,  resumeText: text,  aiAgentConfig: { provider, model: agent, ApiKey: apiKey }})).unwrap();

        setActivePhaseKey(phase.key);
        setLastActionOrigin("ai");
      } catch (error) {
        console.error("AI fetch failed:", error);
      }
    },
    [agent, apiKey, dispatch, provider]
  );

  // Save all profile changes
  const handleSave = useCallback(async () => {
    if (!resumeId || !token) return;
    if (!window.confirm("Are you sure you want to save all changes?")) return;

    try {
      await dispatch(saveResumeById({ resumeId })).unwrap();
    } catch (error) {
      console.error("Failed to save resume:", error);
    }
  }, [resumeId, token, dispatch]);

  const toggleAccordion = useCallback(
    (key) => {
      setActivePhaseKey((prevKey) => (prevKey === key ? null : key));
      setLastActionOrigin("form");
    },
    []
  );

  
  return (
    <main className="bg-[color:var(--color-background-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)] mb-8 text-center animate-fade-in">
          {formDataMap?.name || "New Resume"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          <ProfileForm phases={resumeextractionPhases} expandedPhase={activePhaseKey} isLoading={isLoading} formDataMap={formDataMap}
            toggleAccordion={toggleAccordion} handleFetchFromAI={handleFetchFromAI} renderField={renderField} handleSave={handleSave}
            scrollToPhase={lastActionOrigin === "preview" ? activePhaseKey : null}/>
        <ProfilePreview extractionPhases={resumeextractionPhases} toggleAccordion={toggleAccordion} scrollToPreview={lastActionOrigin === "preview" ? activePhaseKey : null}/>
        </div>
      </div>
    </main>
  );
}
