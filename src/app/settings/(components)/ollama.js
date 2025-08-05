'use client';

import { api_Ollama } from '@components/ai/llmapi';
import { useState } from 'react';

export const Ollama = () => {
  const [aiconfig, setAiconfig] = useState({
    ApiKey: 'http://localhost:11434/api/generate',
    model: '',
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

    if (!aiconfig.ApiKey.trim() || !aiconfig.model.trim()) {
      setError('Server URL and Model name are required.');
      return;
    }

    try {
      setLoading(true);
      const prompt = 'return integer only: 2+2=?';
      const response = await api_Ollama(prompt, aiconfig.ApiKey, aiconfig.model);

      if (response) {
        setError(` Success`);
        localStorage.setItem('CurrentAiAgent', JSON.stringify(aiconfig));
      } else {
        localStorage.removeItem('CurrentAiAgent');
        setError(' No response from local Ollama server.');
      }
    } catch (err) {
      localStorage.removeItem('CurrentAiAgent');
      setError(err.message);
    } finally {
      setLoading(false);
        window.location.reload()
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Connect to Local Ollama Models</h1>
      <form className="w-full max-w-md shadow p-6 rounded space-y-4" onSubmit={handleTest}>
        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">
            Ollama Server URL
          </label>
          <input
            type="text"
            name="ApiKey"
            value={aiconfig.ApiKey}
            onChange={handleChange}
            placeholder="http://localhost:11434/api/generate"
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">
            Model Name (Exact)
          </label>
          <input
            type="text"
            name="model"
            value={aiconfig.model}
            onChange={handleChange}
            placeholder="e.g., llama3.2"
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
          {loading ? 'Testing...' : 'Test Ollama'}
        </button>
      </form>
    </div>
  );
};

