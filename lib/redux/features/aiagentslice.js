import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api_Gemini, api_HuggingFaceai, api_Ollama } from '@components/ai/llmapi';

// --- ASYNC THUNK ---

export const connectAiAgent = createAsyncThunk(
  'aiAgent/connect',
  async (config, { rejectWithValue }) => {
    try {
      const { provider, model, ApiKey } = config;
      const prompt = 'return integer only: 2+2=?';
      let response;

      if (provider === 'Gemini') {
        response = await api_Gemini(prompt, model, ApiKey);
        if (!response) throw new Error('Connection failed. Check API key.');
      } else if (provider === 'HuggingFace') {
        response = await api_HuggingFaceai(prompt, model, ApiKey);
        if (response != 4) throw new Error('API returned no response. Check model or key.');
      } else if (provider === 'Ollama') {
        response = await api_Ollama(prompt, ApiKey, model);
        if (!response) throw new Error('No response from local Ollama server.');
      } else {
        throw new Error('Unsupported AI provider.');
      }
      
      // If successful, return the config to be saved in the state
      return config;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---

const initialState = {
  agent: null,
  provider: null,
  apiKey: null,
  loading: 'idle',
  error: null,
};

const aiAgentSlice = createSlice({
  name: 'aiAgent',
  initialState,
  reducers: {
    setAgent: (state, action) => {
      state.agent = action.payload.model || action.payload.provider;
      state.provider = action.payload.provider;
      state.apiKey = action.payload.ApiKey;
    },
    clearAgent: (state) => {
      state.agent = null;
      state.provider = null;
      state.apiKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectAiAgent.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(connectAiAgent.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.agent = action.payload.model || action.payload.provider;
        state.provider = action.payload.provider;
        state.apiKey = action.payload.ApiKey;
      })
      .addCase(connectAiAgent.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
        state.agent = null;
        state.provider = null;
        state.apiKey = null;
      });
  },
});

export const { setAgent, clearAgent } = aiAgentSlice.actions;
export default aiAgentSlice.reducer;