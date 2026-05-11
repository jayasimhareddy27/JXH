import { createSlice } from "@reduxjs/toolkit";
import { initialJobState } from "./state";
import {
  fetchJobs,
  createJob,
  fetchJobById,
  updateJob,
  deleteJob
} from "./thunks";

const jobSlice = createSlice({
  name: "jobs",
  initialState: initialJobState,
  reducers: {
    hydrateJobs: (state, action) => {
      state.trackerListing = action.payload.trackerListing || [];
      state.marketListing = action.payload.marketListing || [];
      state.currentJob = action.payload.currentJob || null;
      state.hydrated = true;
    },
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    builder

      /* ===============================
         FETCH ALL JOBS
      =============================== */
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;

        if (action.meta.arg === "market") {
          state.marketListing = action.payload;
        } else {
          state.trackerListing = action.payload;
          state.trackerListing = action.payload;
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         FETCH SINGLE JOB
      =============================== */
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         CREATE JOB
      =============================== */
      .addCase(createJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;

        // Add new job to top of tracker list
        state.trackerListing.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         UPDATE JOB 
      =============================== */
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;

        const updatedJob = action.payload;
        if (!updatedJob?._id) return;

        if (state.currentJob && state.currentJob._id === updatedJob._id) {
          state.currentJob = {
            ...state.currentJob,
            ...updatedJob,
          };
        }
        // Sync the Tracker List (the main dashboard list)
        const index = state.trackerListing.findIndex(
          (j) => j._id === updatedJob._id
        );

        if (index !== -1) {
          state.trackerListing[index] = {
            ...state.trackerListing[index],
            ...updatedJob,
          };
        }

        // Sync Market List (if the job exists there too)
        const marketIndex = state.marketListing.findIndex(
          (j) => j._id === updatedJob._id
        );
        if (marketIndex !== -1) {
          state.marketListing[marketIndex] = {
            ...state.marketListing[marketIndex],
            ...updatedJob,
          };
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      /* ===============================
          DELETE JOB 
      =============================== */
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        const deletedJobId = action.payload;

        // 1. Remove from Tracker Listing
        state.trackerListing = state.trackerListing.filter(
          (job) => job._id !== deletedJobId
        );

        // 2. Remove from Market Listing (if applicable)
        state.marketListing = state.marketListing.filter(
          (job) => job._id !== deletedJobId
        );

        // 3. Clear currentJob if it was the one deleted
        if (state.currentJob?._id === deletedJobId) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
            
  }
});

export const { setSearchFilter, clearCurrentJob,hydrateJobs,setCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
