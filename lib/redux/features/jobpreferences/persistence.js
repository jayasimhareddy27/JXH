"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { hydrateVault } from "./slice";

export default function CareerVaultPersistence() {
  const dispatch = useDispatch();
  const isInitialMount = useRef(true);
  
  // Use shallowEqual to prevent unnecessary re-renders
  const careerStore = useSelector((state) => state.careerStore, shallowEqual);

  // 1. Hydrate on Mount: Pull from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jxc_career_vault_cache");
      if (saved) {
        const parsedData = JSON.parse(saved);
        dispatch(hydrateVault(parsedData));
      } else {
        // Mark as hydrated even if empty to enable future saving
        dispatch(hydrateVault({ 
          profiles: careerStore.profiles, 
          activeIdx: 0 
        }));
      }
    } catch (err) {
      console.error("Career Vault Hydration Error:", err);
      dispatch(hydrateVault({ 
        profiles: careerStore.profiles, 
        activeIdx: 0 
      }));
    }
  }, [dispatch]);

  // 2. Persist on Change: Save to LocalStorage
  useEffect(() => {
    // Skip saving on the very first mount before hydration completes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only save if the slice confirms hydration has finished
    if (careerStore.hydrated) {
      const dataToSave = {
        profiles: careerStore.profiles,
        activeIdx: careerStore.activeIdx
      };
      localStorage.setItem("jxc_career_vault_cache", JSON.stringify(dataToSave));
    }
  }, [careerStore.profiles, careerStore.activeIdx, careerStore.hydrated]);

  return null;
}