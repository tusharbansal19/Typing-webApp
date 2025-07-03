import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import contestReducer from '../features/contest/contestSlice';
import themeReducer from '../features/theme/themeSlice';
import matchReducer from '../features/matchSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    contest: contestReducer,
    theme: themeReducer,
    match: matchReducer,
  },
}); 