import { createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '@lib/redux/features/toast/thunks';


// read all resumes
export const fetchResumes = createAsyncThunk(
  'resumes/resumecrud/fetchResumes',
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


//create resume
export const createResume = createAsyncThunk(
  'resumes/resumecrud/createResume',
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

// delete resume
export const deleteResume = createAsyncThunk(
  'resumes/resumecrud/deleteResume',
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


// Copy/create resume
export const copyResume = createAsyncThunk(
  'resumes/resumecrud/copyResume',
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


// update/save resume by ID
export const uploadResume_AI_Ref = createAsyncThunk(
  'resumes/resumecrud/uploadResume_AI_Ref',
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


// Make primary resume
export const makePrimaryResume = createAsyncThunk(
  'resumes/resumecrud/makePrimary',
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
      return resumeId;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


export const markAIPrimaryResume = createAsyncThunk(
  'resumes/resumecrud/markAIPrimaryResume',
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
      return resumeId;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


export const markProfileResume = createAsyncThunk(
  'resumes/resumecrud/markProfileResume',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/userreferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ myProfileRef: resumeId }), // Matches the key for Profile
      });

      if (!response.ok) throw new Error('Failed to update profile resume');
      
      const data = await response.json();
      dispatch(displayToast({ message: "Profile source updated successfully", type: "success" }));
      
      // Returns the ID to update the Redux state
      return resumeId; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user references
export const returnuseReference = createAsyncThunk(
  'resumes/resumecrud/returnuseReference',
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
