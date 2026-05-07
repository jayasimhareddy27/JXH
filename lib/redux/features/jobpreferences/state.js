import { INITIAL_STATE } from './index';

export const initialState = {
  profiles: [],
  activeIdx: 0,
  primaryUserDataRef: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  hydrated: false // Ensures we don't persist initial state over cached data
};