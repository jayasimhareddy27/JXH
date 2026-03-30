
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
