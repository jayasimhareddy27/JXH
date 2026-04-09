import { resumeformatPrompts } from "@/prompts/resume/schema";
import { convertResumeToPromptString } from ".";
import { updatePhase } from "../../../editor/slice";
import { saveDocumentById } from "../../../editor/thunks";
import { fetchfromai } from "@public/components/ai/llmapi";

export const generateresumefromjobdata = (
  aiAgent, 
  sectionIds, 
  jobData, 
  sourceResume, 
  dispatch, 
  displayToast, 
  signal
) => async () => {
  const token = localStorage.getItem("token");
  const { apiKey, agent, provider } = aiAgent;
  
  try {
    // We use the SOURCE resume as the base for the prompt strings
    let baseResume = sourceResume ? structuredClone(sourceResume) : {};    

    for (const id of sectionIds) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      
      const config = Object.values(resumeformatPrompts).find(p => p.id === id);
      if (!config) continue;

      // The AI takes info from SOURCE and tailors it to JOB
      const prompt = `${config.prompt} ${convertResumeToPromptString(baseResume)} JobDescription: ${jobData?.rawDescription}`;
      
      const response = await fetchfromai(prompt, apiKey, agent, provider, 1000);
      const cleanJson = response.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanJson);
      
      // We update the EDITOR (the resume you are currently looking at)
      dispatch(updatePhase({ phaseKey: config.key, data: parsedData }));
      
      // Immediately save the progress to the database
      dispatch(saveDocumentById());
      
      // Update local loop variable so next section in loop has updated context
    }
    

  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error("AI Generation Error:", error);
    dispatch(displayToast({ message: `Failed: ${error.message}`, type: 'error' }));
    return null;
  }
};