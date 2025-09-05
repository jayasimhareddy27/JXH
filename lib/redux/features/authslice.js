import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setTheme } from './themeslice'; // Import setTheme to dispatch it from a thunk

// --- ASYNC THUNKS ---

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',headers: { 'Content-Type': 'application/json' },body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      if (data.references?.theme) {
        dispatch(setTheme(data.references.theme));
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/signup', 
        {method: 'POST',  headers: { 'Content-Type': 'application/json' },  body: JSON.stringify(formData),});
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed.');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// --- SLICE DEFINITION ---

const initialState = {
  user: null,
  token: null,
  favResumeTemplateId: 'template01',
  favCoverLetterId: 'defaultCoverLetter',
  loading: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.references) {
        state.favResumeTemplateId = action.payload.references.favResumeTemplateId;
        state.favCoverLetterId = action.payload.references.favCoverLetterId;
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Handle both login and signup success
    builder
      .addMatcher(
        (action) => [loginUser.fulfilled.type, signupUser.fulfilled.type].includes(action.type),
        (state, action) => {
          state.loading = 'succeeded';
          state.error = null;
          state.user = action.payload.user;
          state.token = action.payload.token;
          if (action.payload.references) {
            state.favResumeTemplateId = action.payload.references.favResumeTemplateId;
            state.favCoverLetterId = action.payload.references.favCoverLetterId;
          }
        }
      )
      // Handle both login and signup pending
      .addMatcher(
        (action) => [loginUser.pending.type, signupUser.pending.type].includes(action.type),
        (state) => {
          state.loading = 'loading';
          state.error = null;
        }
      )
      // Handle both login and signup failure
      .addMatcher(
        (action) => [loginUser.rejected.type, signupUser.rejected.type].includes(action.type),
        (state, action) => {
          state.loading = 'failed';
          state.error = action.payload; // error message from rejectWithValue
        }
      );
  },
});

export const { setCredentials, clearCredentials, setFavTemplate } = authSlice.actions;
export default authSlice.reducer;