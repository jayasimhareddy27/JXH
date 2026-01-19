"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useParams } from "next/navigation";

import { fetchResumeById, saveResumeById, fetchAIdata_resume } from "@lib/redux/features/resumes/resumeeditor/thunks";
import { returnuseReference } from "@lib/redux/features/resumes/resumecrud/thunks"; // fetch AI & profile refs
import { extractionPhases } from "@public/staticfiles/prompts/index";
import renderField from "./(components)/renderfields";
import ProfileForm from "./(components)/profileform";
import ProfilePreview from "./(components)/profilepreview";

import { Edit } from "lucide-react";
import Link from "next/link";
import { templates } from "@resumetemplates/templatelist";

export default function NewResume() {
  const dispatch = useDispatch();
  const params = useParams();
  const resumeId = params?.id;

  const { token, aiAgent: { agent, provider, apiKey }, profile: { formDataMap, loading }, resumecrud: { aiResumeRef }} = useSelector(
    (state) => ({
      token: state.auth.token,
      aiAgent: state.aiAgent,
      profile: state.resumeEditor,
      resumecrud: state.resumecrud
    }),
    shallowEqual
  );

  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [lastActionOrigin, setLastActionOrigin] = useState(null);
  const [previewMode, setPreviewMode] = useState("resume"); 

  const isLoading = loading === "loading";

  // --- FETCH resume AND references on mount ---
  useEffect(() => {
    if (!token || !resumeId) return;
    
    // fetch the main resume
    dispatch(fetchResumeById(resumeId));

    // fetch AI and profile references from backend
    dispatch(returnuseReference(token));
  }, [token, resumeId, dispatch]);

    const activeTemplateObj = templates.find(t => t.id === formDataMap?.templateId) || templates[0];
    const SelectedTemplate = activeTemplateObj.page;
    
  // --- FETCH AI data for a phase ---
  const handleFetchFromAI = useCallback(
    async (phase) => {
      if (!aiResumeRef) {
        return alert("No AI resume reference found. Please create or link an AI resume first.");
      }

      // fetch AI-connected resume text
      const res = await fetch(`/api/resume/${aiResumeRef}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const json = await res.json();
      const text = json?.resumetextAireference;

      if (!text) {
        return alert("No resume text found in AI resume.");
      }

      try {
        await dispatch(fetchAIdata_resume({
          phase,
          resumeText: text,
          aiAgentConfig: { provider, model: agent, ApiKey: apiKey }
        })).unwrap();

        setActivePhaseKey(phase.key);
        setLastActionOrigin("ai");
      } catch (error) {
        console.error("AI fetch failed:", error);
        alert("Failed to fetch phase data from AI.");
      }
    },
    [aiResumeRef, agent, apiKey, dispatch, provider]
  );

  // --- Save all profile changes ---
  const handleSave = useCallback(async () => {
    if (!resumeId || !token) return;
    if (!window.confirm("Are you sure you want to save all changes?")) return;

    try {
      await dispatch(saveResumeById({ resumeId })).unwrap();
      alert("Resume saved successfully!");
    } catch (error) {
      console.error("Failed to save resume:", error);
      alert("Failed to save resume.");
    }
  }, [resumeId, token, dispatch]);

  // --- Accordion toggle ---
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
        <div className="col-span-5">
          <div className="card sticky top-0 z-10 flex items-center justify-between p-3 border-b">
            <h2 className="text-lg font-semibold">  {previewMode === "profile" ? "Profile Preview" : "Resume Preview"}</h2>

            <div className="flex gap-2">
              <button onClick={() => setPreviewMode("profile")} className={  previewMode === "profile"    ? "btn-primary"    : "btn-secondary"}>
                Details
              </button>

              <button onClick={() => setPreviewMode("resume")} className={previewMode === "resume" ? "btn-primary" : "btn-secondary"}>
                Resume
              </button>
            </div>
          </div>

          {/* Preview Body */}
          <div className="p-4">
            {previewMode === "profile" ? (
              <ProfilePreview extractionPhases={extractionPhases} toggleAccordion={toggleAccordion} 
              scrollToPreview={lastActionOrigin === "preview" ? activePhaseKey : null}/>
            ) : (
              <div className="">
                <Link href={`/editor/cl/${resumeId}`} className="float-right">
                    <Edit />
                </Link>
                <div>
                  </div>
              </div>
            )}
          </div>
        </div>

          <div className="col-span-2">
            <ProfileForm phases={extractionPhases} expandedPhase={activePhaseKey} isLoading={isLoading} 
              formDataMap={formDataMap} toggleAccordion={toggleAccordion} handleFetchFromAI={handleFetchFromAI} 
              renderField={renderField} handleSave={handleSave}
              scrollToPhase={lastActionOrigin === "preview" ? activePhaseKey : null}/>
              
          </div>
        </div>
      </div>
    </main>
  );
}

//{formDataMap && (<SelectedTemplate/>)}