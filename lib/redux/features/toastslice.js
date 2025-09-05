import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// This is an async thunk that shows a toast and then hides it after a delay.
export const displayToast = createAsyncThunk(
  'toast/displayToast',
  async (payload, { dispatch }) => {
    dispatch(showToast(payload));
    await new Promise(resolve => setTimeout(resolve, 4000));
    return dispatch(hideToast());
  }
);

const initialState = {
  message: '',
  type: 'info', // 'info', 'success', or 'error'
  visible: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
      state.message = '';
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;