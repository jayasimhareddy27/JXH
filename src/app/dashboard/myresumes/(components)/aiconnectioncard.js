"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Bot, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

import { extractTextFromFile } from '.'; 
import { returnuseReference, uploadResume_AI_Ref } from '@lib/redux/features/resumeslice';

const AIConnectionCard = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [references, setReferences] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocallyLoading, setIsLocallyLoading] = useState(true);

  // 1. Initial Load: Check if AI reference already exists
  useEffect(() => {
    const fetchReferences = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLocallyLoading(false);
        return;
      }
      try {
        const resultAction = await dispatch(returnuseReference(token));
        setReferences(resultAction.payload);
      } catch (err) {
        console.error("Failed to load AI references:", err);
      } finally {
        setIsLocallyLoading(false);
      }
    };
    fetchReferences();
  }, [dispatch]);

  // 2. Handle File Selection and Upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      
      // Save local backups
      localStorage.setItem('resumeRawText', text || '');
      localStorage.setItem('resumeFileName', file.name);

      const fileData = { name: file.name, resumetextAireference: text };
      
      // Upload to server
      await dispatch(uploadResume_AI_Ref(fileData));
      
      // Refresh the local state to show "Access Granted"
      setReferences((prev) => ({
        ...prev,
        aiResumeRef: { name: file.name }
      }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsProcessing(false);
      e.target.value = null; // Reset input
    }
  };


  if (isLocallyLoading) {
    return (
      <div className="card w-full h-full p-6 flex items-center justify-center border border-[color:var(--color-border-primary)] shadow-lg animate-pulse">
        <div className="text-[color:var(--color-text-secondary)] font-bold">Verifying AI Knowledge...</div>
      </div>
    );
  }

  return (
    <div className="card w-full h-full flex flex-col justify-center p-6 border border-[color:var(--color-border-primary)] shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center h-full">
        
        {/* LEFT SECTION: Info & Status */}
        <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-[color:var(--color-cta-bg)] text-[color:var(--color-cta-text)] shadow-md">
              <Bot size={26} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[color:var(--color-text-primary)] leading-tight">AI Resume Access</h2>
              <p className="text-xs sm:text-sm text-[color:var(--color-text-secondary)] mt-1.5">
                AI uses this to learn your background and assist with applications.
              </p>
            </div>
          </div>


        </div>

        {/* RIGHT SECTION: The Integrated Upload Button */}
        <div className="md:col-span-4 h-full flex items-stretch">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx"
            disabled={isProcessing}
          />
          <button 
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[color:var(--color-border-primary)] hover:border-[color:var(--color-cta-bg)] hover:bg-[color:var(--color-background-primary)] transition-all duration-300 group shadow-sm hover:shadow-md py-4 disabled:opacity-50"
          >
            <Upload size={15} className={`text-[color:var(--color-text-secondary)] group-hover:text-[color:var(--color-cta-bg)] transition-transform ${isProcessing ? 'animate-bounce' : 'group-hover:-translate-y-1'}`} />
            <span className="font-black text-sm uppercase tracking-widest text-[color:var(--color-text-primary)]">
              {isProcessing ? 'Saving...' : 'Upload'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIConnectionCard;