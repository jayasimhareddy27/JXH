import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from './toastslice';
import { formatPrompts } from '@components/prompts';
import { fetchPhaseDatainJson } from '@/app/dashboard/profile/edit/(components)';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (token, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/userdata', {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) throw new Error('Failed to fetch profile.');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveProfile = createAsyncThunk(
    'profile/saveProfile',
    async ({ token }, { getState, dispatch, rejectWithValue }) => {
        try {
            const { formDataMap } = getState().profile;
            const response = await fetch('/api/userdata', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(formDataMap),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save profile.');
            }
            dispatch(displayToast({ message: 'Profile saved successfully', type: 'success' }));
            return await response.json();
        } catch (error) {
            dispatch(displayToast({ message: `Save failed: ${error.message}`, type: 'error' }));
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAIdata = createAsyncThunk(
    'profile/fetchAIData',
    async ({ phase, resumeText, aiAgentConfig }, { dispatch, rejectWithValue }) => {
        try {
            
            if (!resumeText) throw new Error('Please upload your resume first');
            if (!aiAgentConfig.provider || !aiAgentConfig.model || !aiAgentConfig.ApiKey) {
                throw new Error('Please configure an AI agent in settings');
            }
            const data = await fetchPhaseDatainJson(
                phase.id, phase.key, resumeText, aiAgentConfig, !!phase.arrayFieldKey
            );
            dispatch(displayToast({ message: `AI data fetched for ${phase.title}`, type: 'success' }));
            return { phaseKey: phase.key, data };
        } catch (error) {
            dispatch(displayToast({ message: `Failed to fetch AI data: ${error.message}`, type: 'error' }));
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    formDataMap: {},
    loading: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateFormData: (state, action) => {
            const { phaseKey, data } = action.payload;
            state.formDataMap[phaseKey] = data;
        },
        resetPhase: (state, action) => {
            const phaseKey = action.payload;
            const phaseConfig = formatPrompts[phaseKey];
            if (phaseConfig) {
                state.formDataMap[phaseKey] = phaseConfig.initial;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => { state.loading = 'loading'; })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                const serverProfile = action.payload.profile || {};
                const baseProfile = Object.keys(formatPrompts).reduce((acc, key) => {
                    acc[key] = formatPrompts[key].initial;
                    return acc;
                }, {});

                state.formDataMap = { ...baseProfile, ...serverProfile };

                const allDefaultTitles = Object.values(formatPrompts).map(phase => ({
                    key: phase.key,
                    title: phase.title,
                }));
                const savedTitles = serverProfile.sectionTitles || [];
                state.formDataMap.sectionTitles = allDefaultTitles.map(defaultItem => {
                  const savedItem = savedTitles.find(saved => saved.key === defaultItem.key);
                  return savedItem || defaultItem;
                });
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            })
            .addCase(saveProfile.pending, (state) => { state.loading = 'loading'; })
            .addCase(saveProfile.fulfilled, (state) => {
                state.loading = 'succeeded';
            })
            .addCase(saveProfile.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchAIdata.pending, (state) => { state.loading = 'loading'; })
            .addCase(fetchAIdata.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                const { phaseKey, data } = action.payload;
                state.formDataMap[phaseKey] = data;
            })
            .addCase(fetchAIdata.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export const { updateFormData, resetPhase } = profileSlice.actions;
export default profileSlice.reducer;