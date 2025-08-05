"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { extractionPhases } from "@components/prompts";
import renderField from "../(components)/renderfields";
import { fetchPhaseDatainJson, showToast, fetchProfileFromBackend, debouncedSave } from "../(components)/index";
import ToastMessage from "../(components)/toastmessage.js";
import ProfileForm from "../(components)/profileform";
import ProfilePreview from "../(components)/profilepreview";

export default function PhasePage() {
  const [scrollToPhase, setScrollToPhase] = useState(null);
  const handlePreviewClick = useCallback((key) => {
    setExpandedPhase(key);
    setScrollToPhase(key);
  }, []);

  const { phaseId } = useParams();
  const [expandedPhase, setExpandedPhase] = useState(phaseId || null);
  const [formDataMap, setFormDataMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");

  const loadData = useCallback(async () => {
    const userToken = localStorage.getItem("token");
    const localstorageuser = localStorage.getItem("user");

    if (!userToken) {
      showToast("Please log in to continue", setToastMessage, "error");
      window.location.href = "/";
      return;
    }

    setToken(userToken);
    setUser(localstorageuser);
    setIsLoading(true);

    try {
      const backendResponse = await fetchProfileFromBackend(userToken, setToastMessage);
      let newFormDataMap = {};

      if (backendResponse?.success && backendResponse.profile) {
        extractionPhases.forEach((phase) => {
          const phaseData = backendResponse.profile[phase.key]?.entries || backendResponse.profile[phase.key];
          newFormDataMap[phase.key] = phaseData || phase.initial;
        });
      } else {
        newFormDataMap = backendResponse;
      }

      setFormDataMap(newFormDataMap);
      localStorage.setItem("formDataMap", JSON.stringify(newFormDataMap));
    } catch (e) {
      console.error("Failed to load backend data:", e);
      const newFormDataMap = {};
      extractionPhases.forEach((phase) => {
        newFormDataMap[phase.key] = phase.initial;
      });
      setFormDataMap(newFormDataMap);
      localStorage.setItem("formDataMap", JSON.stringify(newFormDataMap));
      showToast("Loaded default profile data", setToastMessage, "info");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (Object.keys(formDataMap).length > 0) {
      localStorage.setItem("formDataMap", JSON.stringify(formDataMap));
    }
  }, [formDataMap]);

  const toggleAccordion = useCallback((key) => {
    setExpandedPhase((prev) => (prev === key ? null : key));
  }, []);

  const setFormData = useCallback((phaseKey, updatedData) => {
    const phase = extractionPhases.find((p) => p.key === phaseKey);
    if (phase?.arrayFieldKey && !Array.isArray(updatedData)) {
      console.warn(`Expected array for ${phaseKey}, received:`, updatedData);
      return;
    }
    setFormDataMap((prev) => ({ ...prev, [phaseKey]: updatedData }));
  }, []);

  const handleReset = useCallback((phase, phaseKey) => {
    setFormDataMap((prev) => ({
      ...prev,
      [phaseKey]: phase.initial,
    }));
    showToast(`${phase.title} reset successfully`, setToastMessage, "success");
  }, []);

  const handleFetchFromAI = useCallback(async (phase) => {
    setIsLoading(true);
    try {
      const resumeText = localStorage.getItem("resumeRawText");
      const aiAgent = JSON.parse(localStorage.getItem("CurrentAiAgent"));
      if (!resumeText) {
        showToast("Please upload your resume first", setToastMessage, "error");
        return;
      }
      if (!aiAgent) {
        showToast("Please select an AI agent", setToastMessage, "error");
        return;
      }

      const data = await fetchPhaseDatainJson(phase.id, phase.key, resumeText, aiAgent, !!phase.arrayFieldKey);
      setFormData(phase.key, data);
      showToast(`AI data fetched for ${phase.title}`, setToastMessage, "success");
    } catch (e) {
      console.error(e);
      showToast(`Failed to fetch AI data for ${phase.title}`, setToastMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [setFormData]);

  const handleSave = useCallback(async () => {
    if (!window.confirm("Are you sure you want to save all changes?")) return;

    setIsLoading(true);
    const combinedData = Object.fromEntries(
      extractionPhases.map((phase) => {
        const dataForPhase = formDataMap[phase.key];
        return [
          phase.key,
          phase.arrayFieldKey
            ? { entries: Array.isArray(dataForPhase) ? dataForPhase : [] }
            : (typeof dataForPhase === 'object' && dataForPhase !== null ? dataForPhase : {})
        ];
      })
    );

    await debouncedSave(combinedData, token, user, setToastMessage);
    setIsLoading(false);
  }, [formDataMap, token, user]);

  return (
    <main className="bg-[color:var(--color-background-primary)] p-6 sm:p-8 lg:p-10 min-h-screen">
      <ToastMessage message={toastMessage} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)] mb-8 text-center animate-fade-in">
          Build Your Professional Profile
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProfileForm
            phases={extractionPhases}
            expandedPhase={expandedPhase}
            isLoading={isLoading}
            formDataMap={formDataMap}
            setFormData={setFormData}
            toggleAccordion={toggleAccordion}
            handleFetchFromAI={handleFetchFromAI}
            handleReset={handleReset}
            renderField={renderField}
            setToastMessage={setToastMessage}
            handleSave={handleSave}
            scrollToPhase={scrollToPhase}
          />
          <ProfilePreview
            formDataMap={formDataMap}
            toggleAccordion={handlePreviewClick}
          />
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
