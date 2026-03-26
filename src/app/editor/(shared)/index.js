
import { fetchfromai } from "@public/components/ai/llmapi";
import { resumepromptMap } from "@public/prompts/resume/schema";


// This is a pure utility function for formatting strings. It stays.
export function formatLabel(key) {
  if (!key) return "";
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

// This function handles the AI API call, which is a side effect
// separate from our Redux state management. It stays.

export async function fetchPhaseDatainJson(id,key,referenceText, AiAgent, isArrayPhase = false) {
  const { provider, model, ApiKey } = AiAgent;
  
  const promptTemplate = resumepromptMap[id];
  
  if (!promptTemplate) {
    throw new Error(`No prompt template found for key ${key}`);
  }
  const prompt = `${promptTemplate}\n\n${referenceText}`;
  const rawResponse = await fetchfromai(prompt, ApiKey, model, provider);
  
  const cleanedResponse = rawResponse.trim().replace(/^```json\s*/, '').replace(/^```/, '').replace(/```$/, '').trim();
  const data = JSON.parse(cleanedResponse);
  
  return isArrayPhase ? (Array.isArray(data) ? data : [data]) : data;
}
