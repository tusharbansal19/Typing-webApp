import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomName: '',
  participants: [],
  rankings: [],
  countdown: null,
  currentText: '',
  inputText: '',
  timeLeft: 30,
  isTyping: false,
  userBit: false,
  showResults: false,
  ptr: 0,
  resultData: {
    points: 0,
    speed: 0,
    accuracy: 0,
    mistakes: 0,
  },
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setRoomName(state, action) {
      state.roomName = action.payload;
    },
    setParticipants(state, action) {
      state.participants = action.payload;
    },
    setRankings(state, action) {
      state.rankings = action.payload;
    },
    setCountdown(state, action) {
      state.countdown = action.payload;
    },
    setCurrentText(state, action) {
      state.currentText = action.payload;
    },
    setInputText(state, action) {
      state.inputText = action.payload;
    },
    setTimeLeft(state, action) {
      state.timeLeft = action.payload;
    },
    setIsTyping(state, action) {
      state.isTyping = action.payload;
    },
    setUserBit(state, action) {
      state.userBit = action.payload;
    },
    setShowResults(state, action) {
      state.showResults = action.payload;
    },
    setPtr(state, action) {
      state.ptr = action.payload;
    },
    setResultData(state, action) {
      state.resultData = { ...state.resultData, ...action.payload };
    },
    resetMatch(state) {
      return initialState;
    },
  },
});

export const {
  setRoomName,
  setParticipants,
  setRankings,
  setCountdown,
  setCurrentText,
  setInputText,
  setTimeLeft,
  setIsTyping,
  setUserBit,
  setShowResults,
  setPtr,
  setResultData,
  resetMatch,
} = matchSlice.actions;
export default matchSlice.reducer; 