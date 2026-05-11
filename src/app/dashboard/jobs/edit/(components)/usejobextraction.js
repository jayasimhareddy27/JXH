import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAIdata_job } from "@lib/redux/features/job/thunks";
import { jobExtractionPrompts } from "@public/prompts/jobdescription/schema";
import { sanitizeJobData } from "./index";

export function useJobExtraction(jobData, setJobData, setEligibilityTags) {
  const dispatch = useDispatch();
  const [isExtracting, setIsExtracting] = useState(false);
  const aiAgent = useSelector((state) => state.aiAgent);

  const runExtraction = async () => {
    if (!jobData.rawDescription) return alert("Paste description first!");
    setIsExtracting(true);

    try {
      let tempPayload = { ...jobData };

      for (const phase of jobExtractionPrompts) {
        if (phase.id > 1) await new Promise(r => setTimeout(r, 800));
        
        const result = await dispatch(fetchAIdata_job({
          phase,
          jobDescription: jobData.rawDescription,
          aiAgentConfig: { provider: aiAgent.provider, model: aiAgent.agent, ApiKey: aiAgent.apiKey }
        })).unwrap();

        const data = result?.data;
        if (!data) continue;

        // Phase 1: Core Specs
        if (phase.id === 1) {
          tempPayload = { 
            ...tempPayload, 
            ...data, 
            salary: data.salaryRange || data.salary 
          };
        }
        // Phase 2: Duties
        if (phase.id === 2) {
          tempPayload.aiDescription = data.aiDescription;
        }
        // Phase 3: Requirements & Skills
        if (phase.id === 3) {
          tempPayload.requirements = data.requirements || [];
          tempPayload.skills = data.skills || [];
        }
        // Phase 4: Strategy
        if (phase.id === 4) {
          tempPayload.companyInsights = data.companyInsights;
          tempPayload.businessModel = data.businessModel;
          tempPayload.perks = data.perks || [];
        }
      }

      const final = sanitizeJobData(tempPayload);
      setJobData(final);
      setEligibilityTags(final.requirements);

    } catch (err) {
      console.error("AI Extraction failed:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  return { runExtraction, isExtracting };
}