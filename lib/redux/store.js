import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './features/resumeslice';
import themeReducer from './features/themeslice';
import authReducer from './features/authslice';
import aiAgentReducer from './features/aiagentslice';
import toastReducer from './features/toastslice'; 

// 1. Define the logger middleware
const logger = (store) => (next) => (action) => {
  // This runs on every action across all pages
  console.group(`Action: ${action.type}`); 
  const result = next(action);
  console.log('Next State:', store.getState());
  console.groupEnd();
  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      resumes: resumeReducer,
      theme: themeReducer,
      auth: authReducer,
      aiAgent: aiAgentReducer,
      toast: toastReducer, 
    },
    // 2. Add the logger to the default middleware
    //middleware: (getDefaultMiddleware) =>   getDefaultMiddleware().concat(logger),
  });
};