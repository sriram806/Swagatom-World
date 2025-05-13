import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, User } from '../../types';
import toast from 'react-hot-toast';

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials, {
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', userData, {
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/logout', {}, {
      withCredentials: true,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    toast.error(error.message || 'Failed to sign out');
    throw error;
  }
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
      state.error = null;
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
      state.error = null;
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