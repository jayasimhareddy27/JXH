import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './features/resumeslice';
import themeReducer from './features/themeslice';
import authReducer from './features/authslice';
import aiAgentReducer from './features/aiagentslice';
import profileReducer from './features/profileslice';
import toastReducer from './features/toastslice'; 

export const makeStore = () => {
  return configureStore({
    reducer: {
      resumes: resumeReducer,
      theme: themeReducer,
      auth: authReducer,
      aiAgent: aiAgentReducer,
      profile: profileReducer,
      toast: toastReducer, 
    },
  });
};