// Helper to purge all auth-related data from the browser
const clearAuthStorage = () => {
  const keys = [
    "token",
    "user",           // Added: Essential for persistence
    "resumeRefs",
    "resumeFileName",
    "resumeRawText",
    "theme",
  ];
  
  keys.forEach((k) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(k);
    }
  });
};

export const setCredentials = (state, action) => {
  // 1. Update Redux State
  state.user = action.payload.user;
  state.token = action.payload.token;

};

export const clearCredentials = (state) => {
  state.user = null;
  state.token = null;

// This is the "Nuclear" clear you wanted
  if (typeof window !== 'undefined') {
    localStorage.clear(); 
  }

};