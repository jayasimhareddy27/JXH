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

    // Optional: directly update designConfig (layout / container classes)
    updateDesignConfig: (state, action) => {
      const { layout, containers } = action.payload;
      state.formDataMap.designConfig = {
        ...state.formDataMap.designConfig,
        layout: layout ?? state.formDataMap.designConfig?.layout ?? 'primary',
        containers: {
          ...state.formDataMap.designConfig?.containers,
          ...containers
        }
      };
    }
  },

  extraReducers: (builder) => {
    builder
      // --- Fetch resume from backend ---
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.currentResume = action.meta.arg;

        const payloadFormData = action.payload || {};

        // Ensure designConfig always exists
        state.formDataMap = {
          ...payloadFormData,
          designConfig: {
            layout: payloadFormData?.designConfig?.layout || 'primary',
            containers: payloadFormData?.designConfig?.containers || {}
          }
        };
      })

      // --- Save resume updates ---
      .addCase(saveResumeById.fulfilled, (state, action) => {
        const payloadFormData = action.payload || {};
        state.formDataMap = {
          ...payloadFormData,
          designConfig: {
            layout: payloadFormData?.designConfig?.layout || 'primary',
            containers: payloadFormData?.designConfig?.containers || {}
          }
        };
      })

      // --- Fetch AI phase data ---
      .addCase(fetchAIdata_resume.fulfilled, (state, action) => {
        const { phaseKey, data } = action.payload;

        state.formDataMap = {
          ...state.formDataMap,
          [phaseKey]: data,
          designConfig: {
            ...state.formDataMap.designConfig
          } // preserve layout & container classes
        };
      });
  }
});

export const {
  updateResumePhase,
  resetResumePhase,
  addResumePhaseItem,
  removeResumePhaseItem,
  updateDesignConfig
} = resumeEditorSlice.actions;

export default resumeEditorSlice.reducer;