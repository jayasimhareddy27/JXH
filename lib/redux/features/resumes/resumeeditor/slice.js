import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { fetchAIdata_resume , fetchResumeById, saveResumeById } from './thunks';
import { formatPrompts } from '@public/staticfiles/prompts/userdetailextraction';


const resumeEditorSlice = createSlice({
  name: 'resumeEditor',
  initialState,
  reducers: {
        // slice.js (add inside reducers)
    moveSection: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const order = state.formDataMap.designConfig.order;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= order.length ||
        toIndex >= order.length
      ) return;

      const [moved] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, moved);
    },

    selectContainer: (state, action) => {
      state.formDataMap.designConfig.selectedContainer = action.payload;
    },

    clearSelectedContainer: (state) => {
      state.formDataMap.designConfig.selectedContainer = null;
    },
    updateResumePhase: (state, action) => {
      const { phaseKey, data } = action.payload;

      // If we are updating designConfig, we must merge it, not replace it
      if (phaseKey === "designConfig") {
        state.formDataMap.designConfig = {
          ...state.formDataMap.designConfig,
          ...data
        };
      } else {
        state.formDataMap[phaseKey] = data;
      }
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

    updateContainerStyle: (state, action) => {
      const { id, style } = action.payload;

      const containers = state.formDataMap.designConfig.containers;

      containers[id] = {
        ...(containers[id] || {}),
        style: {
          ...(containers[id]?.style || {}),
          ...style,
        },
      };
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
              ...payloadFormData?.designConfig, // Preserve everything from DB
              layout: payloadFormData?.designConfig?.layout || 'primary',
              containers: payloadFormData?.designConfig?.containers || {},
              visibility: payloadFormData?.designConfig?.visibility || {}, // FIX: Added visibility
              selectedContainer: null // Reset selection on fetch for clean UI
            }
          };      
      })

      // --- Save resume updates ---
      .addCase(saveResumeById.fulfilled, (state, action) => {
        const payloadFormData = action.payload || {};
        state.formDataMap = {
          ...payloadFormData,
          designConfig: {
            ...payloadFormData?.designConfig,
            layout: payloadFormData?.designConfig?.layout || 'primary',
            containers: payloadFormData?.designConfig?.containers || {},
            visibility: payloadFormData?.designConfig?.visibility || {} // FIX: Added visibility
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
  selectContainer,
  clearSelectedContainer,
  updateResumePhase,
  resetResumePhase,
  addResumePhaseItem,
  removeResumePhaseItem,
  updateContainerStyle,
  moveSection,
  updateDesignConfig
} = resumeEditorSlice.actions;


export default resumeEditorSlice.reducer;