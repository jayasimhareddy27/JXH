'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectAiAgent } from '@lib/redux/features/aiagent/thunks';
import { displayToast } from '@lib/redux/features/toast/thunks';

export const Ollama = () => {
  const [aiconfig, setAiconfig] = useState({ ApiKey: 'http://localhost:11434/api/generate', model: '' });
  const dispatch = useDispatch();

  // 1. Get the loading state from the Redux store
  const { loading } = useSelector((state) => state.aiAgent);
  const isLoading = loading === 'loading';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAiconfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleTest = (e) => {
    e.preventDefault();
    if (!aiconfig.ApiKey.trim() || !aiconfig.model.trim()) {
      dispatch(displayToast({ message: 'Server URL and Model name are required.', type: 'error' }));
      return;
    }

    // 2. Dispatch the async thunk, which will handle the loading state
    dispatch(connectAiAgent({ provider: 'Ollama', ...aiconfig }))
      .unwrap()
      .then(() => {
        dispatch(displayToast({ message: 'Successfully connected to Ollama!', type: 'success' }));
        window.location.reload();
      })
      .catch((error) => {
        dispatch(displayToast({ message: error, type: 'error' }));
      });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Connect to Local Ollama Models</h1>
      <form className="w-full max-w-md shadow p-6 rounded space-y-4" onSubmit={handleTest}>
        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">Ollama Server URL</label>
          <input type="text" name="ApiKey" value={aiconfig.ApiKey} onChange={handleChange} placeholder="http://localhost:11434/api/generate" className="form-input" required />
        </div>
        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">Model Name (Exact)</label>
          <input type="text" name="model" value={aiconfig.model} onChange={handleChange} placeholder="e.g., llama3.2" className="form-input" required />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded transition bg-blue-600 text-white disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test Ollama'}
        </button>
      </form>
    </div>
  );
};