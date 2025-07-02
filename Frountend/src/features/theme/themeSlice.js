import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light', // or 'dark'
  glass: true,
  font: 'Inter',
  color: '#2563eb',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setGlass(state, action) {
      state.glass = action.payload;
    },
    setFont(state, action) {
      state.font = action.payload;
    },
    setColor(state, action) {
      state.color = action.payload;
    },
  },
});

export const { toggleMode, setGlass, setFont, setColor } = themeSlice.actions;
export default themeSlice.reducer; 