import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, User } from '../../types';

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post('http://localhost:3000/api/auth/login', credentials, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: { username: string; email: string; password: string }) => {
    const response = await axios.post('http://localhost:3000/api/auth/register', userData, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const response = await axios.post('http://localhost:3000/api/auth/logout', {}, {
    withCredentials: true,
  });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Sign In
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.user;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Sign in failed';
    });

    // Sign Up
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.user;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Sign up failed';
    });

    // Sign Out
    builder.addCase(signOut.fulfilled, (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export default authSlice.reducer;