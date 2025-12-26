"use client";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function StoreLogger() {
  // Select each slice individually to avoid the performance warning
  const resumes = useSelector((state) => state.resumes);
  const auth = useSelector((state) => state.auth);
  const aiAgent = useSelector((state) => state.aiAgent);
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    // This will log to your console on every update across any page
    console.group("🚀 Global Redux Store Update");
    console.log("Resumes:", resumes);
    console.log("Auth:", auth);
    console.log("AI Agent:", aiAgent);
    console.log("Theme:", theme);
    console.groupEnd();
  }, [resumes, auth, aiAgent, theme]);

  return null; // This component has no UI
}