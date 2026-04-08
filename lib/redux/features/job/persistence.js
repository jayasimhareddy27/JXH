"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { hydrateJobs } from "./slice";

export default function JobsPersistence() {
  const dispatch = useDispatch();
  const isInitialMount = useRef(true);
  
  const jobsState = useSelector((state) => state.jobsStore, shallowEqual);

  // 1. Hydrate on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jxc_jobs_cache");
      if (saved) {
        const parsedData = JSON.parse(saved);
        dispatch(hydrateJobs(parsedData));
      } else {
        // CRITICAL: Even if no data exists, we must mark hydration as complete
        dispatch(hydrateJobs({ trackerListing: [], marketListing: [], currentJob: null }));
      }
    } catch (err) {
      console.error("Failed to hydrate jobs from cache:", err);
      // Ensure the app isn't stuck waiting for hydration on error
      dispatch(hydrateJobs({ trackerListing: [], marketListing: [], currentJob: null }));
    }
  }, [dispatch]);

  // 2. Persist on Change
  useEffect(() => {
    // Skip the first run so we don't overwrite localStorage with the 
    // initial Redux state before the hydration useEffect (above) has finished.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Check for "hydrated" flag to ensure we don't save default initial state over real data
    if (jobsState.hydrated) {
      const dataToSave = {
        trackerListing: jobsState.trackerListing,
        marketListing: jobsState.marketListing,
        currentJob: jobsState.currentJob
      };
      localStorage.setItem("jxc_jobs_cache", JSON.stringify(dataToSave));
    }
  }, [jobsState.trackerListing, jobsState.marketListing, jobsState.currentJob, jobsState.hydrated]);

  return null;
}