import { geminiModels, huggingFaceModels } from "@/globalvar/companydetails";

export async function fetchfromai(prompt, apiKey, selectedAgent) {
  if (apiKey.startsWith("http")) {
    return await api_Ollama(prompt, apiKey, selectedAgent);
  } 
  else if (geminiModels.some(model => selectedAgent.startsWith(model.value))) {
    return await api_Gemini(prompt, selectedAgent, apiKey);
  } 
  else if (huggingFaceModels.some(model => selectedAgent.startsWith(model.value))) {
    return await api_HuggingFaceai(prompt, selectedAgent, apiKey);
  } 
  else {
    throw new Error(`Unsupported AI agent: ${selectedAgent}`);
  }
}

async function api_HuggingFaceai(prompt, model, apiKey) {
  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [  {    role: 'user',    content: prompt,  },],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}




// === Gemini ===
async function api_Gemini(prompt,model,apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  contents: [{ role: 'user', parts: [{ text: prompt }] }],}),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}



// === Local LLM (Ollama) ===
async function api_Ollama(prompt, url, model) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(data.response);
  
  return data.response || '';
}

export {api_Gemini,api_HuggingFaceai,api_Ollama}