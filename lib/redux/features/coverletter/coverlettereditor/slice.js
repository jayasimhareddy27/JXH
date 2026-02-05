import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { fetchCoverLetterById, saveCoverLetterById } from './thunks';

const coverletterEditorSlice = createSlice({
  name: 'coverletterEditor',
  initialState,
  reducers: {
    // Select a specific part of the cover letter (e.g., 'header', 'body') to style
    selectContainer: (state, action) => {
      state.formDataMap.designConfig.selectedContainer = action.payload;
    },

    clearSelectedContainer: (state) => {
      state.formDataMap.designConfig.selectedContainer = null;
    },

    // Update layout type or general config
    updateDesignConfig: (state, action) => {
      state.formDataMap.designConfig = {
        ...state.formDataMap.designConfig,
        ...action.payload,
      };
    },

    // Update styles (colors, fonts, margins) for specific containers
    updateContainerStyle: (state, action) => {
      const { id, style } = action.payload;
      const containers = state.formDataMap.designConfig.containers;

      state.formDataMap.designConfig.containers[id] = {
        ...(containers[id] || {}),
        style: {
          ...(containers[id]?.style || {}),
          ...style,
        },
      };
    },

    // Toggle sections like 'date', 'subjectLine', or 'signature'
    toggleVisibility: (state, action) => {
      const { key } = action.payload;
      const visibility = state.formDataMap.designConfig.visibility;
      state.formDataMap.designConfig.visibility[key] = !visibility[key];
    },

    // Reorder sections if the cover letter layout is modular
    moveSection: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const order = state.formDataMap.designConfig.order;
      if (fromIndex >= 0 && toIndex >= 0 && toIndex < order.length) {
        const [moved] = order.splice(fromIndex, 1);
        order.splice(toIndex, 0, moved);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // --- Fetch logic ---
      .addCase(fetchCoverLetterById.fulfilled, (state, action) => {
        state.currentCoverletter = action.meta.arg; // Store the ID
        const payload = action.payload || {};
        
        // Merge fetched designConfig with initial state defaults
        state.formDataMap.designConfig = {
          ...state.formDataMap.designConfig,
          ...(payload.designConfig || {}),
          selectedContainer: null, // Reset UI selection on load
        };
      })

      // --- Save logic ---
      .addCase(saveCoverLetterById.fulfilled, (state, action) => {
        const payload = action.payload || {};
        if (payload.designConfig) {
          state.formDataMap.designConfig = {
            ...state.formDataMap.designConfig,
            ...payload.designConfig,
          };
        }
      });
  },
});

export const {
  selectContainer,
  clearSelectedContainer,
  updateDesignConfig,
  updateContainerStyle,
  toggleVisibility,
  moveSection,
} = coverletterEditorSlice.actions;

export default coverletterEditorSlice.reducer;