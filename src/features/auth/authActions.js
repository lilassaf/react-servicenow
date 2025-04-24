import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';



export const userLogin = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        '/api/get-token',
        { username, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000
        }
      );
      return data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({
          type: 'network_error',
          message: 'Network error. Please check your connection.'
        });
      }
      return rejectWithValue({
        type: error.response.data?.error || 'authentication_error',
        message: error.response.data?.message || 'Login failed'
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ 
    user_name, 
    user_password, 
    first_name, 
    last_name, 
    email, 
    mobile_phone 
  }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `/api/create-user`,
        { user_name, user_password, first_name, last_name, email, mobile_phone },
        config
      );

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const userLogout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Always clear client-side storage immediately
      localStorage.removeItem('access_token');
      
      // Only attempt API logout if we have a token
      if (token) {
        await axios.post(
          `/api/logout`,
          {},
          {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            },
            // Important for cookies to be included
            withCredentials: true
          }
        );
      }
      
      return true;
    } catch (error) {
      console.error('Logout API error:', error);
      // Even if API fails, we consider logout successful on client side
      return true;
    }
  }
);