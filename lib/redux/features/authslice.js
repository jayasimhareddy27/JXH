import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setTheme } from './themeslice';

// --- ASYNC THUNKS ---
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed.');
      if (data.references?.theme) dispatch(setTheme(data.references.theme));
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed.');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAccount = createAsyncThunk(
  'auth/updateAccount',
  async (data, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update account.');
      return result.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- SLICE DEFINITION ---
const initialState = {
  user: null,
  token: null,
  favResumeTemplateId: 'Default Resume by JXH',
  favCoverLetterId: 'Default Cover Letter by JXH',
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
      localStorage.removeItem('token');
      localStorage.removeItem('resumeRefs');
      localStorage.removeItem('resumeFileName');
      localStorage.removeItem('resumeRawText');
      localStorage.removeItem('theme');
    },
  },
  extraReducers: (builder) => {
    // --- UPDATE ACCOUNT FIRST ---
    builder
      .addCase(updateAccount.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });

    // --- LOGIN & SIGNUP MATCHERS ---
    builder
      .addMatcher(
        (action) =>
          [loginUser.fulfilled.type, signupUser.fulfilled.type].includes(action.type),
        (state, action) => {
          state.loading = 'succeeded';
          state.error = null;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
          if (action.payload.references) {
            state.favResumeTemplateId = action.payload.references.favResumeTemplateId;
            state.favCoverLetterId = action.payload.references.favCoverLetterId;
            
            const resumeRefs = {
              primaryResumeId: action.payload.references.primaryResumeId,
              myProfileRef: action.payload.references.myProfileRef,
              aiResumeRef: action.payload.references.aiResumeRef,
            };
            
            localStorage.setItem('resumeRefs', JSON.stringify(resumeRefs));
          }
        }
      )
      .addMatcher(
        (action) =>
          [loginUser.pending.type, signupUser.pending.type].includes(action.type),
        (state) => {
          state.loading = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [loginUser.rejected.type, signupUser.rejected.type].includes(action.type),
        (state, action) => {
          state.loading = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
