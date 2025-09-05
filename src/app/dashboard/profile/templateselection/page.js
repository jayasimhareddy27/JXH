'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import UploadButton from '@components/buttons/uploadbutton';
import { TemplateSelector } from '@resumetemplates/templateselector';
import { StatusMessage } from '@components/cards/index';

const extractTextFromFile = async (file) => {
  const { default: pdfToText } = await import('react-pdftotext');
  const mammoth = await import('mammoth/mammoth.browser');

  if (file.type === 'application/pdf') {
    return pdfToText(file);
  }
  if (
    file.type ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
};

export default function UserExtractionsPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [hasMounted, setHasMounted] = useState(false);
  
  const { agent: aiAgent } = useSelector((state) => state.aiAgent);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const aiConfigured = hasMounted && !!aiAgent;


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) window.location.href = "/login";

    const storedTemplate = localStorage.getItem('resumeTemplate');
    const resumeRawText = localStorage.getItem('resumeRawText');
    if (storedTemplate) setSelectedTemplate(storedTemplate);

  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    localStorage.setItem('resumeTemplate', template);
  };

  const handleManualStart = () => {
    if (!selectedTemplate) return alert('Please select a resume template.');
    router.push('/dashboard/profile/edit/');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage('Extracting text from your document...');

    try {
      const text = await extractTextFromFile(file);
      localStorage.setItem('resumeRawText', text);
      if (selectedTemplate) localStorage.setItem('resumeTemplate', selectedTemplate);
      setStatusMessage('Extraction successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard/profile/edit/');
      }, 800);
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setIsProcessing(false);
      e.target.value = null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-4">
      <div className="shadow-modal flex-1 p-8 relative">
        <h2 className="text-4xl font-semibold mb-6 text-center text-[color:var(--color-text-primary)]">
          Choose your default Resume Template
        </h2>

        <div className="h-[75vh] overflow-y-auto ">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelect={handleTemplateSelect}
          />
        </div>
        <div className="sticky bottom-0 w-full bg-[color:var(--color-background-secondary)] border-t border-[color:var(--color-border-primary)] flex flex-col sm:flex-row justify-center items-center gap-3 p-4 rounded-b-lg mt-4">
          <button
            onClick={handleManualStart}
            disabled={!selectedTemplate}
            className="p-3 form-button w-full sm:w-auto"
          >
            Enter Details Manually
          </button>
          
          <div className='px-5 py-2 text-center text-[color:var(--color-text-secondary)] font-semibold'>OR</div>

          <div className="flex flex-col items-center w-full sm:w-auto">
            {/* This condition will now be consistent between server and first client render */}
            {!aiConfigured && hasMounted && (
              <p className="card-tag text-xs text-center mb-1">
                ⚠️ Set up AI first before uploading
              </p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx"
              disabled={isProcessing}
            />
            <UploadButton
              onClick={() => !isProcessing && fileInputRef.current.click()}
              disabled={isProcessing || !selectedTemplate || !aiConfigured}
              isProcessing={isProcessing}
            />
          </div>
        </div>
        <StatusMessage message={statusMessage} />
      </div>
    </main>
  );
}