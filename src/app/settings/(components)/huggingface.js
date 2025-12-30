'use client';

import { huggingFaceModels } from '@/globalvar/companydetails';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectAiAgent } from '@lib/redux/features/aiagent/thunks';
import { displayToast } from '@lib/redux/features/toast/thunks';

export const HuggingFace = () => {
  const [aiconfig, setAiconfig] = useState({ model: huggingFaceModels[0].value, ApiKey: '' });
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.aiAgent);
  const isLoading = loading === 'loading';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAiconfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleTest = (e) => {
    e.preventDefault();
    dispatch(connectAiAgent({ provider: 'HuggingFace', ...aiconfig }))
      .unwrap()
      .then(() => {
        dispatch(displayToast({ message: 'Successfully connected to HuggingFace!', type: 'success' }));
      })
      .catch((error) => {
        dispatch(displayToast({ message: error, type: 'error' }));
      });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Connect to Meta LLaMA Models</h1>
      <form className="w-full max-w-md shadow p-6 rounded space-y-4" onSubmit={handleTest}>
        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">Select Model</label>
          <select name="model" value={aiconfig.model} onChange={handleChange} className="form-input">
            {huggingFaceModels.map((model) => (
              <option key={model.value} value={model.value}>{model.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">HuggingFace API Key</label>
          <input type="text" name="ApiKey" value={aiconfig.ApiKey} onChange={handleChange} placeholder="Enter your HF token"
            className="form-input" required />
        </div>
        <button type="submit" className="w-full py-2 rounded transition bg-blue-600 text-white disabled:opacity-50"
          disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test HuggingFace'}
        </button>
      </form>
    </div>
  );
};