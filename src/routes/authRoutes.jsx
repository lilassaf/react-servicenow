// src/routes/authRoutes.jsx
import React from 'react';
import Register from '../views/auth/Register';
import Login from '../views/auth/login';

// routes/auth.js
const authRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  // ... other routes
];

export default authRoutes; 