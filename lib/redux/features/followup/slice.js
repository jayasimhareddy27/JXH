import { createSlice } from "@reduxjs/toolkit";
import { fetchFollowUps } from "./thunks";

const followUpSlice = createSlice({
  name: "followups",
  initialState: {
    followUps: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowUps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowUps.fulfilled, (state, action) => {
        state.loading = false;
        state.followUps = action.payload;
      })
      .addCase(fetchFollowUps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default followUpSlice.reducer;