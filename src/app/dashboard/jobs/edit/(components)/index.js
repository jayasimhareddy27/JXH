'use client'
import { fetchfromai } from "@public/components/ai/llmapi";
import { jobPromptMap } from "@public/prompts/jobdescription";

export async function fetchJobPhaseData(id, key, jobDescription, AiAgent, isArrayPhase = false) {
  const { provider, model, ApiKey } = AiAgent;
  
  const promptTemplate = jobPromptMap[id];
  
  if (!promptTemplate) {
    throw new Error(`No job prompt template found for ID ${id} (Key: ${key})`);
  }

  const prompt = `${promptTemplate}\n\n${jobDescription}`;
  
  // 2. Server-side AI Call
  const rawResponse = await fetchfromai(prompt, ApiKey, model, provider, 1000);
  
  // 3. Clean Markdown/Backticks
  const cleanedResponse = rawResponse.trim()
  .replace(/^```json\s*/, '')
  .replace(/^```/, '')
  .replace(/```$/, '')
  .trim();
  
  let data = JSON.parse(cleanedResponse);

  if (isArrayPhase && Array.isArray(data)) {
    if (id === 2) {
      // [{requirement: "SQL"}] -> ["SQL"]
      return data.map(item => item.requirement || item).filter(Boolean);
    }
    if (id === 3) {
      // [{tag: "Remote"}] -> ["Remote"]
      return data.map(item => item.tag || item).filter(Boolean);
    }
    return data;
  }

  return isArrayPhase ? [data] : data;
}


export const sanitizeJobData = (raw) => {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    companyName: raw.companyName?.trim() || "Unknown Company",
    position: raw.position?.trim() || "Position Not Specified",
    rawDescription: raw.rawDescription || "",
    aiDescription: raw.aiDescription || "",
    businessModel: raw.businessModel || "",
    companyInsights: raw.companyInsights || "",
    seniorityLevel: raw.seniorityLevel || "",
    jobType: raw.jobType || "Full-time",
    stage: raw.stage || "saved",
    state: raw.state || "pending",
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    perks: Array.isArray(raw.perks) ? raw.perks : [],
    marketIntel: {
      difficultyRating: Number(raw.marketIntel?.difficultyRating) || 3,
      isFeatured: Boolean(raw.marketIntel?.isFeatured) || false,
      interviewQuestions: Array.isArray(raw.marketIntel?.interviewQuestions) ? raw.marketIntel.interviewQuestions : []
    },
    salary: raw.salary || "Not Mentioned",
    jobLocation: raw.jobLocation || "Not Mentioned",
    jobUrl: raw.jobUrl || "",
    postedDate: (!raw.postedDate || raw.postedDate === "YYYY-MM-DD") ? today : raw.postedDate,
    applicationDate: raw.applicationDate || today
  };
};