import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomName: '',
  participants: [],
  mode: 'multiplayer',
  timeLimit: 60,
  wordList: [],
  startedAt: null,
  endedAt: null,
  isStarted: false,
  winnerId: null,
};

const matchRealtimeSlice = createSlice({
  name: 'matchRealtime',
  initialState,
  reducers: {
    setRoomName(state, action) {
      state.roomName = action.payload;
    },
    setParticipants(state, action) {
      state.participants = action.payload;
    },
    setMode(state, action) {
      state.mode = action.payload;
    },
    setTimeLimit(state, action) {
      state.timeLimit = action.payload;
    },
    setWordList(state, action) {
      state.wordList = action.payload;
    },
    setStartedAt(state, action) {
      state.startedAt = action.payload;
    },
    setEndedAt(state, action) {
      state.endedAt = action.payload;
    },
    setStarted(state, action) {
      state.isStarted = action.payload;
    },
    setWinnerId(state, action) {
      state.winnerId = action.payload;
    },
    resetMatchRealtime(state) {
      return initialState;
    },
  },
});

export const {
  setRoomName,
  setParticipants,
  setMode,
  setTimeLimit,
  setWordList,
  setStartedAt,
  setEndedAt,
  setStarted,
  setWinnerId,
  resetMatchRealtime,
} = matchRealtimeSlice.actions;

export default matchRealtimeSlice.reducer; 