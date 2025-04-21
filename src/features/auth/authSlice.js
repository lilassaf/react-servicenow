// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { userLogin, registerUser } from './authActions';

const initialState = {
  loading: false,
  userInfo: null,
  userToken: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // You can add other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        console.log('Login successful, payload:', {
          ...payload,
          id_token: '******', // Mask the token in the logs
        });
        state.loading = false;
        state.userInfo = payload;  // Store user info
        state.userToken = payload.id_token;  // Save the token (assuming it's 'id_token')
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        console.log('Login failed, error:', payload); // Debugging
        state.loading = false;
        state.error = payload?.message || 'Login failed'; // Fallback error message
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
