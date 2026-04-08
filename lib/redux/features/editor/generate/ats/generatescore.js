import { atsAnalysisPrompt } from "@/prompts/ats/schema";
import { fetchfromai } from "@public/components/ai/llmapi";
import { convertResumeToPromptString } from "../resume";


export const generatesuggestions = async (aiAgent, formDataMap, currentJob, signal) => {
  try {
    // 1. Prepare Prompt
    const resumeStr = convertResumeToPromptString(formDataMap);
    const fullPrompt = atsAnalysisPrompt.prompt
      .replace("{{resumeData}}", resumeStr)
      .replace("{{jobDescription}}", currentJob.rawDescription || "");

    // 2. Fetch from AI (Note: matched to your fetchfromai params)
    const response = await fetchfromai(
      fullPrompt, 
      aiAgent.apiKey, 
      aiAgent.agent, 
      aiAgent.provider, 
      2000
    );

    // 3. Extract JSON safely
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");
    const aiData = JSON.parse(jsonMatch[0]);
   return {
      suggestions: aiData?.strategic_advice || [],
    };

  } catch (error) {
    console.error("ATS Calculation Error:", error);
    return { score: 0, /* ... default error object */ };
  }
};