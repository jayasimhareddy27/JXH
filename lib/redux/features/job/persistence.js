"use client";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { hydrateJobs } from "./slice";

export default function JobsPersistence() {
  const dispatch = useDispatch();
  
  // Select the specific parts of the job state we want to save
  const jobsState = useSelector((state) => state.jobsStore, shallowEqual);

  // 1. Hydrate on Mount: Load from LocalStorage into Redux
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jxh_jobs_cache");
      if (saved) {
        const parsedData = JSON.parse(saved);
        dispatch(hydrateJobs(parsedData));
      }
    } catch (err) {
      console.error("Failed to hydrate jobs from cache:", err);
    }
  }, [dispatch]);

  // 2. Persist on Change: Save Redux state to LocalStorage
  useEffect(() => {
    // Only persist if there's actually data, to avoid overwriting cache with empty arrays
    if (jobsState.trackerListing.length > 0 || jobsState.marketListing.length > 0) {
      const dataToSave = {
        trackerListing: jobsState.trackerListing,
        marketListing: jobsState.marketListing,
        currentJob: jobsState.currentJob
      };
      localStorage.setItem("jxh_jobs_cache", JSON.stringify(dataToSave));
    }
  }, [jobsState.trackerListing, jobsState.marketListing, jobsState.currentJob]);

  return null;
}