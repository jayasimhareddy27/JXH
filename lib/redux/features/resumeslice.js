import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { displayToast } from './toastslice';
import { fetchPhaseDatainJson } from '@/app/dashboard/myresumes/(components)';
import { resumeformatPrompts } from '@components/prompts/resume';

// --- THUNKS ---

// Create a resume
export const createResume = createAsyncThunk(
  'resumes/createResume',
  async (name, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create resume');
      }

      const { _id } = await response.json();
      
      dispatch(displayToast({ message: `Resume "${name}" created successfully!`, type: 'success' }));
      return { _id, name };
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// Fetch AI data for a resume phase
export const fetchAIdata_resume = createAsyncThunk(
  'resumes/fetchAIdata_resume',
  async ({ phase, resumeText, aiAgentConfig }, { dispatch, getState, rejectWithValue }) => {
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

      const { formDataMap } = getState().resumes;
      
      // ✅ merge into existing resume object
      return {
        ...formDataMap,
        [phase.key]: data,
      };
    } catch (error) {
      dispatch(displayToast({ message: `Failed to fetch AI data: ${error.message}`, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all resumes
export const fetchResumes = createAsyncThunk(
  'resumes/fetchResumes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/resume', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch resumes');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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


// Save/update resume
export const saveResumeById = createAsyncThunk(
  "resumes/saveResumeById",
  async ({ resumeId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { formDataMap } = getState().resumes;

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


// Delete a resume
export const deleteResume = createAsyncThunk(
  'resumes/deleteResume',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/resume/${resumeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete resume');
      dispatch(displayToast({ message: "Resume deleted successfully", type: "success" }));
      return resumeId;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

// Copy resume
export const copyResume = createAsyncThunk(
  'resumes/copyResume',
  async ({ resumeId, newName }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/resume/copy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId, newName }),
      });
      if (!response.ok) throw new Error('Failed to copy resume');
      const data = await response.json();
      dispatch(displayToast({ message: `Copied to "${newName}" successfully`, type: "success" }));
      return data.newResume;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

// Make primary resume
export const makePrimaryResume = createAsyncThunk(
  'resumes/makePrimary',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/userreferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ primaryResumeId: resumeId }),
      });
      if (!response.ok) throw new Error('Failed to update primary resume');
      const data = await response.json();
      dispatch(displayToast({ message: "Primary resume updated successfully", type: "success" }));
      return data.primaryResumeId;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);
export const markAIPrimaryResume = createAsyncThunk(
  'resumes/markAIPrimaryResume',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/userreferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aiResumeRef: resumeId }),
      });
      if (!response.ok) throw new Error('Failed to update primary resume');
      const data = await response.json();
      dispatch(displayToast({ message: "Primary AI resume updated successfully", type: "success" }));
      return data.aiResumeRef;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user references
export const returnuseReference = createAsyncThunk(
  'resumes/returnuseReference',
  async (token, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/userreferences/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user references');
      const data = await response.json();
      return data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


// Uploading AI Reference Resume
export const uploadResume_AI_Ref = createAsyncThunk(
  'resumes/uploadResume_AI_Ref',
  async (File, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { name, resumetextAireference } = await File;
      
      const response = await fetch('/api/resume', {  
        method: 'POST',  
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },  
        body: JSON.stringify({ name, resumetextAireference }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create resume');
      }

      // ✅ Make sure your API returns the FULL object: { _id, name, updatedAt, ... }
      const newResume = await response.json(); 
      
      const response2 = await fetch("/api/userreferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aiResumeRef: newResume._id }), // Use the ID from the object
      });

      if (!response2.ok) throw new Error('Failed to update AI reference');
      
      dispatch(displayToast({ message: `Resume "${name}" created successfully!`, type: 'success' }));
      
      // ✅ Return the full object so allResumes is updated correctly
      return newResume; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE ---

const initialState = {
  allResumes: [],
  currentResume: null,
  primaryResumeId: null,
  aiResumeRef:null,
  myProfileRef:null,
  formDataMap: {},   // ✅ always an object (not null)
  loading: 'idle',
  error: null,
};

const resumeSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {

  // Update a phase (object or array)
  updateResumePhase: (state, action) => {
    const { phaseKey, data } = action.payload;
    state.formDataMap[phaseKey] = data;
  },

  // Reset phase to empty object or array
  resetResumePhase: (state, action) => {
    const phaseKey = action.payload;
    const phaseConfig = resumeformatPrompts[phaseKey];
    if (phaseConfig) {
        state.formDataMap[phaseKey] = phaseConfig.initial;
    }

  },

  // Add new item to array-type phase
  addResumePhaseItem: (state, action) => {
    const { phaseKey, newItem } = action.payload;
    const current = state.formDataMap[phaseKey] || [];
    if (!Array.isArray(current)) return;
    state.formDataMap[phaseKey] = [...current, newItem];
  },

  // Remove item from array-type phase
  removeResumePhaseItem: (state, action) => {
    const { phaseKey, index } = action.payload;
    const current = state.formDataMap[phaseKey] || [];
    if (!Array.isArray(current)) return;
    state.formDataMap[phaseKey] = current.filter((_, i) => i !== index);
  },
},
  extraReducers: (builder) => {
    builder
      // Fetch all resumes
      .addCase(fetchResumes.pending, (state) => { state.loading = 'loading'; })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.allResumes = action.payload.resumes;
        state.primaryResumeId = action.payload.primaryResumeId;
      })
      .addCase(fetchResumes.rejected, (state, action) => { state.loading = 'failed'; state.error = action.payload; })

      // Create resume
      .addCase(createResume.pending, (state) => { state.loading = 'loading'; })
      .addCase(createResume.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentResume = action.payload;
        state.allResumes.push(action.payload);
      })
      .addCase(createResume.rejected, (state, action) => { state.loading = 'failed'; state.error = action.payload; })

      // Upload resume for AI Reference
      .addCase(uploadResume_AI_Ref.pending, (state) => { state.loading = 'loading'; })
      .addCase(uploadResume_AI_Ref.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.aiResumeRef = action.payload._id;
        state.allResumes.push(action.payload);
      })
      .addCase(uploadResume_AI_Ref.rejected, (state, action) => { state.loading = 'failed'; state.error = action.payload; })

      // Delete resume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.allResumes = state.allResumes.filter((r) => r._id !== action.payload);
      })

      // Copy resume
      .addCase(copyResume.fulfilled, (state, action) => {
        state.currentResume = action.payload;
        state.allResumes.push(action.payload);
      })

      // Make primary
      .addCase(makePrimaryResume.fulfilled, (state, action) => {
        state.currentResume = action.payload;
        state.primaryResumeId = action.payload;
      })

      // Fetch resume by ID
      .addCase(fetchResumeById.pending, (state,action) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentResume = action.meta.arg;
        state.formDataMap = action.payload || {};
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      // Save resume
      .addCase(saveResumeById.pending, (state) => { state.loading = 'loading'; })
      .addCase(saveResumeById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.formDataMap = action.payload;
        const index = state.allResumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.allResumes[index] = action.payload;
      })
      .addCase(saveResumeById.rejected, (state, action) => { state.loading = 'failed'; state.error = action.payload; })

      // Fetch AI data
      .addCase(fetchAIdata_resume.pending, (state) => { state.loading = 'loading'; })
      .addCase(fetchAIdata_resume.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.formDataMap = action.payload;
      })
      .addCase(fetchAIdata_resume.rejected, (state, action) => { state.loading = 'failed'; state.error = action.payload; });
  },
});

export const { updateResumePhase, resetResumePhase, addResumePhaseItem, removeResumePhaseItem } = resumeSlice.actions;
export default resumeSlice.reducer;
