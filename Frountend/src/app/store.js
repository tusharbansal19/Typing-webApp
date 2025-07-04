import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import contestReducer from '../features/contest/contestSlice';
import themeReducer from '../features/theme/themeSlice';
import matchRealtimeReducer from '../features/matchRealtimeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    contest: contestReducer,
    theme: themeReducer,
    matchRealtime: matchRealtimeReducer,
  },
}); 