import { createSlice } from "@reduxjs/toolkit";
import { fetchFollowUps, createFollowUp, updateFollowUp,deleteFollowUp } from "./thunks"; 

const followUpSlice = createSlice({
  name: "followups",
  initialState: {
    followUps: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Reducers for synchronous actions can go here if needed
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH ALL FOLLOW-UPS --- */
      .addCase(fetchFollowUps.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFollowUps.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.followUps = action.payload;
      })
      .addCase(fetchFollowUps.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* --- CREATE NEW FOLLOW-UP --- */
      .addCase(createFollowUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createFollowUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Logic: Push the new object from DB into the state array
        state.followUps.push(action.payload);
      })
      .addCase(createFollowUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* --- UPDATE FOLLOW-UP (The Missing Piece) --- */
      .addCase(updateFollowUp.pending, (state) => {
        // We set status to loading, but usually for updates, 
        // we handle local loading states in the component (updatingId)
        state.status = 'loading';
      })
      .addCase(updateFollowUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedTask = action.payload;

        if (updatedTask.status === 'completed') {
          state.followUps = state.followUps.filter(f => f._id !== updatedTask._id);
        } else {
          const index = state.followUps.findIndex(f => f._id === updatedTask._id);
          if (index !== -1) {
            state.followUps[index] = updatedTask;
          }
        }
      })
      .addCase(updateFollowUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteFollowUp.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.followUps = state.followUps.filter(f => f._id !== deletedId);
      });
      
  },
});

export default followUpSlice.reducer;