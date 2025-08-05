'use client';

import { huggingFaceModels } from '@/globalvar/companydetails';
import { api_HuggingFaceai } from '@components/ai/llmapi';
import { useState } from 'react';

export const HuggingFace = () => {
  const [aiconfig, setAiconfig] = useState({
    model: huggingFaceModels[0].value,
    ApiKey: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAiconfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setError('');

    if (!aiconfig.ApiKey.trim()) {
      setError('API key is required');
      return;
    }

    try {
      setLoading(true);
      const prompt = 'no explanation just return integer only, return length should be 1  : 2+2=? ';
      const response = await api_HuggingFaceai(prompt, aiconfig.model, aiconfig.ApiKey);
      if (response==4) {
        setError(` Success`);
        localStorage.setItem('CurrentAiAgent', JSON.stringify(aiconfig));
        window.location.reload()
      } else {
        console.log(response);
        
        localStorage.removeItem('CurrentAiAgent');
        setError('⚠️ API returned no response. Check model or key.');
      }
    } catch (err) {
      localStorage.removeItem('CurrentAiAgent');
      setError(err.message);
    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Connect to Meta LLaMA Models</h1>
      <form className="w-full max-w-md shadow p-6 rounded space-y-4" onSubmit={handleTest}>
        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">Select Model</label>
          <select
            name="model"
            value={aiconfig.model}
            onChange={handleChange}
            className="form-input"
          >
            {huggingFaceModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">HuggingFace API Key</label>
          <input
            type="text"
            name="ApiKey"
            value={aiconfig.ApiKey}
            onChange={handleChange}
            placeholder="Enter your HF token"
            className="form-input"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded transition bg-blue-600 text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test HuggingFace'}
        </button>
      </form>
    </div>
  );
};

