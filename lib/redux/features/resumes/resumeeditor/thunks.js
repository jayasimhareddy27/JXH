import { createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '@lib/redux/features/toast/thunks';
import { fetchPhaseDatainJson } from '@/app/dashboard/myresumes/(components)';

// Fetch resume by ID
export const fetchResumeById = createAsyncThunk(
  'resumes/fetchResumeById',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch the resume');
      const resume = await response.json();
      
      return resume;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);


// Fetch AI data for a resume phase
export const fetchAIdata_resume = createAsyncThunk(
  'resumes/fetchAIdata_resume',
  async ({ phase, resumeText, formDataMap, aiAgentConfig }, { dispatch, getState, rejectWithValue }) => {
    try {
      if (!resumeText) throw new Error('Please upload your resume first');
      if (!aiAgentConfig.provider || !aiAgentConfig.model || !aiAgentConfig.ApiKey) {
        throw new Error('Please configure an AI agent in settings');
      }
      
      const data = await fetchPhaseDatainJson(
        phase.id,
        phase.key,
        resumeText,
        aiAgentConfig,
        !!phase.arrayFieldKey
      );

      dispatch(displayToast({ message: `AI data fetched for ${phase.title}`, type: 'success' }));

      // ✅ merge into existing resume object
      return {
        phaseKey: phase.key,
        data,
      };
    } catch (error) {
      dispatch(displayToast({ message: `Failed to fetch AI data: ${error.message}`, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);


// Save/update resume
export const saveResumeById = createAsyncThunk(
  "resumes/saveResumeById",
  async ({ resumeId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { formDataMap } = getState().resumeEditor;

      const response = await fetch(`/api/resume/${resumeId}`, {
        method: "PATCH",
        headers: {  "Content-Type": "application/json",  Authorization: `Bearer ${token}`,},
        body: JSON.stringify(formDataMap),
      });

      if (!response.ok) throw new Error("Failed to save the resume");
      const updatedResume = await response.json();
      dispatch(displayToast({ message: "Resume saved successfully!", type: "success" }));
      return updatedResume;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);
