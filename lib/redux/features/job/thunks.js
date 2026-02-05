import { createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '../toast/thunks';
import { fetchJobPhaseData } from '@/app/dashboard/jobs/new/(helpers)/index';

// --- NEW: AI EXTRACTION THUNK ---
export const fetchAIdata_job = createAsyncThunk(
  "jobs/fetchAIdata_job",
  async (
    { phase, jobDescription, aiAgentConfig },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (!jobDescription) {
        throw new Error("Please paste a job description first");
      }

      if (
        !aiAgentConfig?.provider ||
        !aiAgentConfig?.model ||
        !aiAgentConfig?.ApiKey
      ) {
        throw new Error("Please configure an AI agent in settings");
      }

      // Use the helper we built specifically for Jobs (IDs 1-4)
      const data = await fetchJobPhaseData(
        phase.id,
        phase.key,
        jobDescription,
        aiAgentConfig,
        !!phase.arrayFieldKey
      );

      dispatch(displayToast({
        message: `Extracted ${phase.title} successfully`,
        type: "success",
      }));

      return {
        phaseKey: phase.key,
        data
      };
    } catch (error) {
      dispatch(displayToast({
        message: `AI Extraction failed: ${error.message}`,
        type: "error",
      }));
      return rejectWithValue(error.message);
    }
  }
);

// --- UPDATED: FETCH ALL JOBS ---
export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (mode, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`/api/jobs?mode=${mode}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      return data.jobs; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// --- UPDATED: CREATE JOB ---
export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;    
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) throw new Error('Error saving job application');
      
      const savedJob = await response.json();

      dispatch(displayToast({ 
        message: `Job at ${savedJob.companyName || 'selected company'} saved!`, 
        type: 'success' 
      }));

      return savedJob;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// --- UPDATED: FETCH SINGLE JOB ---
export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`/api/jobs/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Job not found');
      
      const data = await response.json();
      return data.job || data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// --- UPDATED: STATUS UPDATE ---
export const updateJobStatus = createAsyncThunk(
  'jobs/updateStatus',
  async ({ jobId, status, companyName }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedJob = await response.json();

      dispatch(displayToast({ 
        message: `${companyName} status updated to ${status}`, 
        type: 'success' 
      }));

      return updatedJob;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);