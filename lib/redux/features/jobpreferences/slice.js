import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { fetchVaultFromDb, syncVaultToDb } from './thunks';
import { INITIAL_STATE, CAREER_STAGE_PRESETS } from './index';

const careerSlice = createSlice({
  name: 'career',
  initialState,
  reducers: {
    setActiveProfile: (state, action) => { state.activeIdx = action.payload; },
    setPrimaryProfile: (state, action) => { state.primaryUserDataRef = action.payload; },
    updateActiveProfile: (state, action) => {
      const { path, value } = action.payload;
      const keys = path.split('.');
      const target = state.profiles[state.activeIdx];
      if (!target) return;
      if (keys.length === 1) target[keys[0]] = value;
      else if (keys.length === 2) target[keys[0]][keys[1]] = value;
      else if (keys.length === 3) target[keys[0]][keys[1]][keys[2]] = value;
    },
    applyCareerPreset: (state, action) => {
      const stage = action.payload;
      const current = state.profiles[state.activeIdx];
      if (CAREER_STAGE_PRESETS[stage] && current) {
        state.profiles[state.activeIdx] = { 
          ...CAREER_STAGE_PRESETS[stage], 
          _id: current._id, 
          label: current.label 
        };
      }
    },
    addProfile: (state) => {
      state.profiles.push({ ...INITIAL_STATE, label: `Profile ${state.profiles.length + 1}` });
      state.activeIdx = state.profiles.length - 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVaultFromDb.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profiles = action.payload.profiles || [];
        state.primaryUserDataRef = action.payload.primaryUserDataRef;
        state.hydrated = true;
      })
      .addCase(syncVaultToDb.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profiles = action.payload.profiles;
        state.primaryUserDataRef = action.payload.primaryUserDataRef;
      });
  }
});

export const { setActiveProfile, updateActiveProfile, addProfile, applyCareerPreset, setPrimaryProfile } = careerSlice.actions;
export default careerSlice.reducer;