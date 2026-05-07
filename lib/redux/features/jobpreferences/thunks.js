import { createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from "../toast/thunks";

export const syncVaultToDb = createAsyncThunk(
  'career/syncVault',
  async (_, {  dispatch,getState, rejectWithValue }) => {
    try {
      const { profiles, primaryUserDataRef } = getState().jobpreferencesstore;
      const response = await fetch('/api/userdata/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles, primaryUserDataRef })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sync career vault');
      }

      dispatch(displayToast({ message: "Vault synced to cloud", type: "success" }));
      return data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVaultFromDb = createAsyncThunk(
  'career/fetchVault',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('/api/userdata');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch career vault');
      }

      return data; // Usually updates state via extraReducers in slice
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);