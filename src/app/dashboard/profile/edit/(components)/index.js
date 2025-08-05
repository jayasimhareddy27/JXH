import { extractionPhases, promptMap } from "@components/prompts";
import { debounce } from "lodash";

export function formatLabel(key) {
  if (!key) return "";
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export async function fetchProfileFromBackend(token, setToastMessage) {
  try {
    const res = await fetch("/api/userdata", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      showToast("Hello! This is your first time entering details. Please fill in the details carefully.", setToastMessage, "info");
      const newFormDataMap = {};
      extractionPhases.forEach((phase) => {
        newFormDataMap[phase.key] = phase.initial;
      });
      return newFormDataMap;
    }
    return res.json();
  } catch (error) {
    showToast("An error occurred while fetching profile. Please check your connection.", setToastMessage, "error");
    const newFormDataMap = {};
    extractionPhases.forEach((phase) => {
      newFormDataMap[phase.key] = phase.initial;
    });
    return newFormDataMap;
  }
}

export async function saveToBackend(payload, token, user, phaseKey, setToastMessage) {
  if (!user) {
    showToast("Please log in to save", setToastMessage, "error");
    return;
  }
  try {
    const response = await fetch(`/api/userdata`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save data");
    }

    const result = await response.json();
    showToast(phaseKey ? `Saved successfully for ${payload[phaseKey]._title}` : "Saved all phases successfully", setToastMessage, "success");
    return result;
  } catch (error) {
    console.error("Error saving data:", error);
    showToast("Error saving data", setToastMessage, "error");
    throw error;
  }
}

export function handleChange(formData, setFormData, value, key, parentIndex = null) {
  const sanitizedValue = typeof value === "string" ? value : String(value);
  if (parentIndex !== null && Array.isArray(formData)) {
    const updated = [...formData];
    updated[parentIndex] = { ...updated[parentIndex], [key]: sanitizedValue };
    setFormData(updated);
  } else if (!Array.isArray(formData)) {
    const updated = { ...formData, [key]: sanitizedValue };
    setFormData(updated);
  } else {
    console.warn("Invalid update: parentIndex null for array-based formData", formData);
    setFormData(formData);
  }
}

export function showToast(msg, callback, type = "info") {
  callback(`${type === "error" ? "⚠️ " : "✅ "}${msg}`);
  setTimeout(() => callback(""), 4000);
}

export async function fetchPhaseDatainJson(id, key, resumeRawText, AiAgent, isArrayPhase = false) {
  const { model, ApiKey } = AiAgent;

  const promptTemplate = promptMap[id];
  
  if (!promptTemplate) {
    throw new Error(`No prompt template found for key ${key}`);
  }
  const prompt = `${promptTemplate}\n\n${resumeRawText}`;

  const response = await fetch("/api/user_extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ApiKey, model }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch phase data");
  }

  const data = await response.json();
  return isArrayPhase ? (Array.isArray(data) ? data : [data]) : data;
}

export const debouncedSave = debounce(async (data, token, user, setToastMessage) => {
  try {
    await saveToBackend(data, token, user, null, setToastMessage);
    showToast("Profile saved successfully", setToastMessage, "success");
  } catch (error) {
    console.error(error);
    showToast("Failed to save profile", setToastMessage, "error");
  }
}, 500);
