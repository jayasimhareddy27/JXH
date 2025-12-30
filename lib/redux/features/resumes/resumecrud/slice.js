import {initialState} from './state';
import { createSlice } from '@reduxjs/toolkit';
import { resumecrudExtraReducers } from './extrareducers';

const resumecrudSlice = createSlice({
  name: 'resumecrud',
  initialState,
  reducers: {},
  extraReducers: resumecrudExtraReducers,

});

export default resumecrudSlice.reducer;