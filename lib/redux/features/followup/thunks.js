import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "../toast/thunks";

export const fetchFollowUps = createAsyncThunk(
  "followups/fetchAll",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch("/api/jobs/followup", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load follow-ups");
      }

      const data = await response.json();
      return data.followUps || data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);  