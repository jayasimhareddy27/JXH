import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { fetchAIdata_resume , fetchResumeById, saveResumeById } from './thunks';
import { formatPrompts } from '@public/staticfiles/prompts/userdetailextraction';


const resumeEditorSlice = createSlice({
  name: 'resumeEditor',
  initialState,
  reducers: {
    updateResumePhase: (state, action) => {
      const { phaseKey, data } = action.payload;
      state.formDataMap[phaseKey] = data;
    },

    resetResumePhase: (state, action) => {
      const phaseKey = action.payload;
      const phaseConfig = formatPrompts[phaseKey];
      if (phaseConfig) {
        state.formDataMap[phaseKey] = phaseConfig.initial;
      }
    },

    addResumePhaseItem: (state, action) => {
      const { phaseKey, newItem } = action.payload;
      const current = state.formDataMap[phaseKey] || [];
      if (Array.isArray(current)) {
        state.formDataMap[phaseKey] = [...current, newItem];
      }
    },

    removeResumePhaseItem: (state, action) => {
      const { phaseKey, index } = action.payload;
      const current = state.formDataMap[phaseKey] || [];
      if (Array.isArray(current)) {
        state.formDataMap[phaseKey] = current.filter((_, i) => i !== index);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.currentResume = action.meta.arg;
        state.formDataMap = action.payload || {};
      })
      .addCase(saveResumeById.fulfilled, (state, action) => {
        state.formDataMap = action.payload;
      })
      .addCase(fetchAIdata_resume.fulfilled, (state, action) => {
        state.formDataMap = action.payload;
      });
  },
});

export const {
  updateResumePhase,
  resetResumePhase,
  addResumePhaseItem,
  removeResumePhaseItem,
} = resumeEditorSlice.actions;

export default resumeEditorSlice.reducer;