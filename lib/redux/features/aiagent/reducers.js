
export const setAgent = (state, action) => {
  state.agent = action.payload.model || action.payload.provider;
  state.provider = action.payload.provider;
  state.apiKey = action.payload.ApiKey;
};

export const clearAgent = (state) => {
  state.agent = null;
  state.provider = null;
  state.apiKey = null;
}

export const setAiStatus = (state, action) => {
  state.aiStatus = action.payload;
};