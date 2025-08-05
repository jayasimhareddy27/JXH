'use client';

import { geminiModels } from '@/globalvar/companydetails';
import { api_Gemini } from '@components/ai/llmapi';
import { useState } from 'react';

export const Gemini = () => {
  const [aiconfig, setAiconfig] = useState({  model: 'gemini-2.0-flash',  ApiKey: '',});
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
        const prompt = '2+2';
        const response = await api_Gemini(prompt, aiconfig.model, aiconfig.ApiKey);
        if(response){
            setError(` Success`);
            localStorage.setItem('CurrentAiAgent', JSON.stringify(aiconfig));
            window.location.reload()
        }else{
            localStorage.removeItem("CurrentAiAgent")
            setError("Please check the API key")
        } 
    } catch (err) {
        localStorage.removeItem("CurrentAiAgent")
        setError('Failed to connect. Please check your API key or model selection.');
        return 
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Connect to Gemini Models</h1>
      <form  className="w-full max-w-md shadow p-6 rounded space-y-4"  onSubmit={handleTest}>
        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">  Select Model</label>
          <select  name="model"  value={aiconfig.model}  onChange={handleChange}  className="form-input">
            {geminiModels.map((model) => (  <option key={model.value} value={model.value}>    {model.label}  </option>))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-[var(--color-form-label)]">  Gemini API Key</label>
          <input  type="text"  name="ApiKey"  value={aiconfig.ApiKey}  onChange={handleChange}  placeholder="Enter your API key"
            className="form-input"  required/>
        </div>

        {error && (  <p className="text-red-600 text-sm text-center">{error}</p>)}

        <button  type="submit"  className="w-full py-2 rounded transition bg-blue-600 text-white disabled:opacity-50"  
            disabled={loading}> {loading ? 'Testing...' : 'Test Gemini'}
        </button>
      </form>
    </div>
  );
};

