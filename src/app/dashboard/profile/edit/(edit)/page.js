"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { fetchProfile, saveProfile, fetchAIdata } from "@lib/redux/features/profileslice";
import { extractionPhases } from "@components/prompts";
import renderField from "../(components)/renderfields";
import ProfileForm from "../(components)/profileform";
import ProfilePreview from "../(components)/profilepreview";

export default function PhasePage() {
  const dispatch = useDispatch();

  const { token, aiAgent: { agent, provider, apiKey }, profile: { formDataMap, loading }} = useSelector(
    (state) => ({  token: state.auth.token,  aiAgent: state.aiAgent,  profile: state.profile}),shallowEqual);

  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [lastActionOrigin, setLastActionOrigin] = useState(null); 

  const isLoading = loading === "loading";

  useEffect(() => {
    if (!token) return;
    dispatch(fetchProfile(token));
  }, [token, dispatch]);

  const handlePreviewClick = useCallback((key) => {
    setActivePhaseKey(key);
    setLastActionOrigin('preview'); 
  }, []);

  const toggleAccordion = useCallback(
    (key) => {
      const newKey = activePhaseKey === key ? null : key;
      setActivePhaseKey(newKey);
      setLastActionOrigin('form'); 
    },
    [activePhaseKey]
  );

  function handleFetchFromAI(phase) {
    const text = localStorage.getItem("resumeRawText");
    if (!text) return alert("No resume text found. Please upload your resume first.");
    
    dispatch(fetchAIdata({phase,resumeText: text,aiAgentConfig: { provider, model: agent, ApiKey: apiKey }}));
  }
  const handleSave = useCallback(() => {
    if (window.confirm("Are you sure you want to save all changes?")) {
      dispatch(saveProfile({ token }));
    }
  }, [token, dispatch]);

  return (
    <main className="bg-[color:var(--color-background-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)] mb-8 text-center animate-fade-in">
          Build Your Professional Profile
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          <ProfileForm phases={extractionPhases} expandedPhase={activePhaseKey}  isLoading={isLoading} formDataMap={formDataMap} 
            toggleAccordion={toggleAccordion}  handleFetchFromAI={handleFetchFromAI} renderField={renderField} handleSave={handleSave}
            scrollToPhase={lastActionOrigin === 'preview' ? activePhaseKey : null}/>

          <ProfilePreview toggleAccordion={handlePreviewClick}  scrollToPreview={lastActionOrigin === 'form' ? activePhaseKey : null}/>
        </div>
      </div>
    </main>
  );
}