import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

const initialState = {
  isAuthenticated: false,
  email: localStorage.getItem('email'),
  user: null, // { uid, email, displayName, ... }
  accessToken: localStorage.getItem('accessToken') || null,
  matchHistory: [],
  personalBest: { wpm: 0, accuracy: 0 },
  loading: false,
  error: null,
  isAuthLoading: true, // for initial auth check
  profileData: null,
  profileLoading: false,
  profileError: null,
};

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/user/me');
      return res.data.user;
    } catch (err) {
      return rejectWithValue('Not authenticated');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post('/user/login', payload);
      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('email', res.data.user.email);
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post('/user/register', payload);
      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  }
);

// Fetch user profile data
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/user/profile');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.put('/user/profile', payload);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Fetch user match history
export const fetchUserMatches = createAsyncThunk(
  'user/fetchUserMatches',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get('/user/matches', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch matches');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.matchHistory = [];
      state.personalBest = { wpm: 0, accuracy: 0 };
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('email');
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    addMatchHistory(state, action) {
      state.matchHistory.push(action.payload);
    },
    setPersonalBest(state, action) {
      state.personalBest = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setProfileData(state, action) {
      state.profileData = action.payload;
    },
    clearProfileError(state) {
      state.profileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthLoading = false;
        state.accessToken = null;
        localStorage.removeItem('accessToken');
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileData = action.payload;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.profileError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(fetchUserMatches.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserMatches.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.matchHistory = action.payload.matches;
        state.profileError = null;
      })
      .addCase(fetchUserMatches.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });
  },
});

export const { logout, setUser, addMatchHistory, setPersonalBest, clearError, setProfileData, clearProfileError } = userSlice.actions;
export default userSlice.reducer; 