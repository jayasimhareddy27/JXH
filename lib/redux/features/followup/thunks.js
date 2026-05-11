import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "../toast/thunks";


export const fetchFollowUps = createAsyncThunk(
  "followups/fetchAll",
  async (jobId = null, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      // Construct URL: if jobId exists, add as query param
      let url = "/api/jobs/followup";
      if (jobId) {
        url += `?jobId=${jobId}`;
      }

      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load follow-ups");
      }

      const data = await response.json();
      // Return the array directly (Backend should return { followUps: [] })
      return data.followUps || data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const createFollowUp = createAsyncThunk(
  "followups/create",
  async (followUpData, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch("/api/jobs/followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(followUpData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create follow-up");
      }

      dispatch(displayToast({ message: "Follow-up scheduled", type: "success" }));
      
      return data.followUp || data; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const updateFollowUp = createAsyncThunk(
  "followups/update",
  async ({ id, updates }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      // CHANGE THIS LINE: Use ?id= instead of /[id]
      const response = await fetch(`/api/jobs/followup?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update follow-up");
      }

      if (updates.status === 'completed') {
        dispatch(displayToast({ message: "Task marked as complete", type: "success" }));
      } else {
        dispatch(displayToast({ message: "Task updated", type: "success" }));
      }

      return data.followUp || data; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFollowUp = createAsyncThunk(
  "followups/delete",
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      // CHANGE THIS LINE: Add '?id=' before the ID
      const response = await fetch(`/api/jobs/followup?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete task");
      }

      dispatch(displayToast({ message: "Task removed", type: "success" }));
      return id; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);