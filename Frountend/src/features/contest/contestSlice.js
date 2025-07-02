import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomName: null,
  mode: 'easy',
  timer: 60,
  participants: [],
  isStarted: false,
  isCountdown: false,
  leaderboard: [],
  stats: {
    wpm: 0,
    cpm: 0,
    accuracy: 0,
    mistakes: 0,
    wordsTyped: 0,
  },
};

const contestSlice = createSlice({
  name: 'contest',
  initialState,
  reducers: {
    setRoom(state, action) {
      state.roomName = action.payload;
    },
    setMode(state, action) {
      state.mode = action.payload;
    },
    setTimer(state, action) {
      state.timer = action.payload;
    },
    setParticipants(state, action) {
      state.participants = action.payload;
    },
    startMatch(state) {
      state.isStarted = true;
    },
    stopMatch(state) {
      state.isStarted = false;
    },
    setLeaderboard(state, action) {
      state.leaderboard = action.payload;
    },
    updateStats(state, action) {
      state.stats = { ...state.stats, ...action.payload };
    },
    resetContest(state) {
      return initialState;
    },
    setCountdown(state, action) {
      state.isCountdown = action.payload;
    },
  },
});

export const { setRoom, setMode, setTimer, setParticipants, startMatch, stopMatch, setLeaderboard, updateStats, resetContest, setCountdown } = contestSlice.actions;
export default contestSlice.reducer; 