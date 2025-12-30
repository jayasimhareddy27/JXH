import { promptMap } from "@public/staticfiles/prompts/userdetailextraction";
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

export async function fetchPhaseDatainJson(id,key,resumeRawText, AiAgent, isArrayPhase = false) {
  const { provider, model, ApiKey } = AiAgent;
  
  const promptTemplate = promptMap[id];
  console.log(promptTemplate);
  
  if (!promptTemplate) {
    throw new Error(`No prompt template found for key ${key}`);
  }
  const prompt = `${promptTemplate}\n\n${resumeRawText}`;

  const response = await fetch("/api/user_extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, provider, model, ApiKey }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch phase data");
  }

  const data = await response.json();
  return isArrayPhase ? (Array.isArray(data) ? data : [data]) : data;
}