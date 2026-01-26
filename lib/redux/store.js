import { configureStore } from '@reduxjs/toolkit';
import aiAgentReducer from './features/aiagent/slice';
import authReducer from './features/auth/slice';
import themeReducer from './features/theme/slice';
import toastReducer from './features/toast/slice'; 
import resumeEditorReducer from './features/resumes/resumeeditor/slice';
import resumecrudReducer from './features/resumes/resumecrud/slice';
import jobReducer from './features/job/slice';

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
      aiAgent: aiAgentReducer,
      auth: authReducer,
      theme: themeReducer,
      toast: toastReducer, 
      resumeEditor: resumeEditorReducer,
      resumecrud: resumecrudReducer,
      jobsStore: jobReducer,
    },
    // 2. Add the logger to the default middleware
    middleware: (getDefaultMiddleware) =>   getDefaultMiddleware().concat(logger),
  });
};