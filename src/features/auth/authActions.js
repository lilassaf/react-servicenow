import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = import.meta.env.MODE !== 'production'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_SERVER_URL;

  export const userLogin = createAsyncThunk(
    '/login',
    async ({ username, password }, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        const { data } = await axios.post(
          `${backendURL}/api/get-token`,
          { username, password },
          config
        );
  
        // Store the correct token in localStorage
        localStorage.setItem('access_token', data.access_token); // Update to store access_token
        return data;
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
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
          `${backendURL}/api/create-user`,
          { 
            user_name,
            user_password,
            first_name,
            last_name,
            email,
            mobile_phone 
          },
          config
        );
  
        return data;
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  );