import { createSlice } from '@reduxjs/toolkit';
import { initialJobState } from './state';
import { fetchJobs, createJob, fetchJobById, updateJobStatus } from './thunks';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: initialJobState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ALL JOBS (Market or Tracker) ---
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 'market') {
          state.marketListing = action.payload;
        } else {
          state.trackerListing = action.payload;
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- FETCH SINGLE JOB BY ID ---
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload; // Populates the details page
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- CREATE NEW JOB ---
      .addCase(createJob.fulfilled, (state, action) => {
        if (state.trackerListing) {
          state.trackerListing.unshift(action.payload);
        }
      })

      // --- UPDATE JOB STATUS ---
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const updatedJob = action.payload;
        
        // 1. Update in the Tracker List if it exists there
        const index = state.trackerListing.findIndex(j => j._id === updatedJob._id);
        if (index !== -1) {
          state.trackerListing[index] = updatedJob;
        }

        // 2. Update the Current Job view if the user is looking at it
        if (state.currentJob && state.currentJob._id === updatedJob._id) {
          state.currentJob = updatedJob;
        }
      });
  }
});

export const { setSearchFilter, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;