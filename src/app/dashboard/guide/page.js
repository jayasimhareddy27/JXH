'use client';
import React, { useState, useEffect } from 'react';

const steps = [
  {
    title: 'Welcome to the Guided Tour!',
    content: 'This guide will walk you through the main features of our application. Click "Next" to get started.',
  },
  {
    title: 'Step 1: The Dashboard',
    content: 'This is your main hub. From here, you can see an overview of your recent activity and access all the key sections of the application.',
  },
  {
    title: 'Step 2: Creating a New Project',
    content: 'To start a new project, click on the "New Project" button in the top right corner. This will open a form where you can enter the project details.',
  },
  {
    title: 'Step 3: Managing Your Settings',
    content: 'You can customize your experience by visiting the "Settings" page. Here, you can change your theme, update your profile, and set your notification preferences.',
  },
  {
    title: 'You\'re All Set!',
    content: 'You have completed the guided tour. You can always revisit this guide from the help menu. Enjoy using the application!',
  },
];

const StepByStepGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Automatically open the guide for new users
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenGuide', 'true');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary fixed bottom-4 right-4"
      >
        Show Guide
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="shadow-modal bg-[var(--color-background-secondary)] rounded-lg p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
            {steps[currentStep].title}
          </h3>
          <button onClick={handleClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-[var(--color-text-secondary)] mb-6">
          {steps[currentStep].content}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentStep === index ? 'w-6 bg-[var(--color-button-primary-bg)]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button onClick={handlePrev} className="btn-secondary">
                Prev
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button onClick={handleNext} className="btn-primary">
                Next
              </button>
            ) : (
              <button onClick={handleClose} className="btn-primary">
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepByStepGuide;
