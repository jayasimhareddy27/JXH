'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateSelector } from '@resumetemplates/templateselector';

export default function TemplateSelectionPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    const storedTemplate = localStorage.getItem('resumeTemplate');
    if (storedTemplate) setSelectedTemplate(storedTemplate);
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    localStorage.setItem('resumeTemplate', template);
  };

  const handleContinue = () => {
    if (!selectedTemplate) return alert('Please select a resume template.');
    router.push('/dashboard/profile/uploadresume');
  };

  return (
    <main className="min-h-screen flex flex-col p-4">
      <div className="shadow-modal flex-1 p-8 relative">
        <h2 className="text-4xl font-semibold mb-6 text-center text-[color:var(--color-text-primary)]">
          Choose Your Resume Template
        </h2>

        <div className="h-[75vh] overflow-y-auto">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelect={handleTemplateSelect}
          />
        </div>

        <div className="sticky bottom-0 w-full bg-[color:var(--color-background-secondary)] border-t border-[color:var(--color-border-primary)] flex justify-center items-center p-4 rounded-b-lg mt-4">
          <button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            className="p-3 form-button w-full sm:w-auto"
          >
            Continue to Upload
          </button>
        </div>
      </div>
    </main>
  );
}
