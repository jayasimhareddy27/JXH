import { atsAnalysisPrompt } from "@/prompts/ats/schema";
import { fetchfromai } from "@public/components/ai/llmapi";
import { convertResumeToPromptString } from "../resume";

export const generatescore = async (aiAgent, formDataMap, currentJob, signal) => {
  try {
    // 1. Prepare the Prompt by injecting current data
    const fullPrompt = atsAnalysisPrompt.prompt.replace("{{resumeData}}", convertResumeToPromptString(formDataMap)).replace("{{jobDescription}}", currentJob.rawDescription || "");

    // 2. Fetch Raw Entities from AI
    const response =  await fetchfromai(aiAgent, fullPrompt, signal, 2000);
    const cleanJson = response.replace(/```json|```/g, "").trim();
    const aiResponse = JSON.parse(cleanJson);
    if (!aiResponse) throw new Error("AI failed to return analysis data.");

    // 3. Local Mathematical Comparison (The "Truth" Layer)
  const { 
      jd_keywords = [], 
      resume_keywords = [], 
      jd_level = "", 
      resume_level = "", 
      soft_skills = [],
      strategic_advice = [],
      verdict = "Analysis complete."
    } = aiResponse;

// 4. Local Mathematical Comparison (The "Truth" Layer)
    const jdSet = new Set(jd_keywords.map(k => k.toLowerCase().trim()));
    const resumeSet = new Set(resume_keywords.map(k => k.toLowerCase().trim()));

    // Find Hits and Misses locally (Prevents AI from "guessing" matches)
    const matchedKeywords = jd_keywords.filter(k => resumeSet.has(k.toLowerCase().trim()));
    const missingKeywords = jd_keywords.filter(k => !resumeSet.has(k.toLowerCase().trim()));

    // 5. Scoring Algorithm
    
    // A. Keyword Match (70% weight)
    const keywordWeight = jd_keywords.length > 0 
      ? (matchedKeywords.length / jd_keywords.length) * 70 
      : 0;

    // B. Seniority Alignment (20% weight)
    let seniorityScore = 0;
    const jLevel = jd_level.toLowerCase();
    const rLevel = resume_level.toLowerCase();
    
    if (jLevel && rLevel) {
      if (jLevel === rLevel) {
        seniorityScore = 20;
      } else if (
        (jLevel.includes("senior") && (rLevel.includes("mid") || rLevel.includes("lead"))) ||
        (jLevel.includes("mid") && rLevel.includes("junior"))
      ) {
        seniorityScore = 10; // Partial match for adjacent levels
      }
    }

    // C. Soft Skill Coverage (10% weight)
    const resumeString = JSON.stringify(formDataMap).toLowerCase();
    const matchedSoftSkills = soft_skills.filter(s => 
      resumeString.includes(s.toLowerCase().trim())
    );
    const softSkillScore = soft_skills.length > 0 
      ? (matchedSoftSkills.length / soft_skills.length) * 10 
      : 0;

    // Final Weighted Calculation
    const finalScore = Math.min(100, Math.round(keywordWeight + seniorityScore + softSkillScore));

    // 6. Return Structured Payload for UI
    return {
      score: finalScore,
      keywordScore: Math.round((matchedKeywords.length / (jd_keywords.length || 1)) * 100),
      foundKeywords: matchedKeywords,
      missingKeywords: missingKeywords,
      suggestions: strategic_advice,
      verdict: verdict,
      levels: { 
        job: jd_level || "Not specified", 
        candidate: resume_level || "Not detected" 
      }
    };

  } catch (error) {
    console.error("Error in generatescore:", error);
    // Return a safe object so the UI doesn't break on a single error
    return {
      score: 0,
      keywordScore: 0,
      foundKeywords: [],
      missingKeywords: [],
      suggestions: ["Try re-running the scan or check your job description length."],
      verdict: "Error analyzing resume. Please try again.",
      levels: { job: "Error", candidate: "Error" }
    };
  }
};