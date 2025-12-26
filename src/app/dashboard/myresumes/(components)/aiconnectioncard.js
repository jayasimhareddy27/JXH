"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, Upload, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

import { extractTextFromFile } from '.'; 
import { returnuseReference, uploadResume_AI_Ref } from '@lib/redux/features/resumeslice';

const AIConnectionCard = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  // ✅ 1. Get the list of all resumes to find the name of the AI reference
  const { allResumes } = useSelector((state) => state.resumes);
  
  const [references, setReferences] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocallyLoading, setIsLocallyLoading] = useState(true);

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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      const fileData = { name: file.name, resumetextAireference: text };
      
      const response = await dispatch(uploadResume_AI_Ref(fileData)).unwrap();
      
      setReferences((prev) => ({
        ...prev,
        references: {
          ...prev?.references,
          aiResumeRef: response._id 
        }
      }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsProcessing(false);
      e.target.value = null; 
    }
  };

  if (isLocallyLoading) {
    return (
      <div className="card w-full h-full p-6 flex items-center justify-center border border-[color:var(--color-border-primary)] shadow-lg animate-pulse">
        <div className="text-[color:var(--color-text-secondary)] font-bold italic">Verifying AI Knowledge...</div>
      </div>
    );
  }

  // ✅ 2. Identify the connected resume object
  const aiRefId = references?.references?.aiResumeRef;
  const connectedResume = allResumes?.find(r => r._id === aiRefId);

  return (
    <div className="card w-full h-full flex flex-col justify-center p-6 border border-[color:var(--color-border-primary)] shadow-lg bg-[color:var(--color-card-bg)]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center h-full">
        
        {/* LEFT SECTION: Info & Status */}
        <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-[color:var(--color-cta-bg)] text-[color:var(--color-cta-text)] shadow-md">
              <Bot size={26} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[color:var(--color-text-primary)] leading-tight">AI Resume Access</h2>
              <p className="text-xs text-[color:var(--color-text-secondary)] mt-1 opacity-80">
                AI uses this to learn your background and assist with applications.
              </p>
            </div>
          </div>

          {/* ✅ 3. Updated Status Alert showing the filename */}
          {connectedResume ? (
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-2.5 text-green-700">
                <CheckCircle2 size={16} className="shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Access Granted: AI Knowledge Synced</span>
              </div>
              <div className="flex items-center gap-2 mt-1 px-2 py-1.5 bg-white/50 rounded border border-green-200/50">
                 <FileText size={12} className="text-green-600" />
                 <span className="text-xs font-bold text-green-800 truncate">{connectedResume.name}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">No Access: Please upload your resume.</span>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Upload Button */}
        <div className="md:col-span-4 h-full flex items-stretch">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" disabled={isProcessing} />
          <button 
            type="button" 
            disabled={isProcessing} 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[color:var(--color-border-primary)] hover:border-[color:var(--color-cta-bg)] hover:bg-[color:var(--color-background-primary)] transition-all duration-300 group shadow-sm hover:shadow-md py-4 disabled:opacity-50"
          >
            <Upload size={18} className={`text-[color:var(--color-text-secondary)] group-hover:text-[color:var(--color-cta-bg)] transition-transform ${isProcessing ? 'animate-bounce' : 'group-hover:-translate-y-1'}`} />
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-primary)]">
              {isProcessing ? 'Processing...' : 'Change Source'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIConnectionCard;