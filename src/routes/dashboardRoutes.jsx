// src/routes/dashboardRoutes.jsx
import React from 'react';
import PrivateRoute from '../components/PrivateRoute'; // Make sure this exists
import DashboardLayout from '../layout/dashbord';
import Home from '../views/dashbord/Dashboard';

const dashboardRoutes = {
  path: '/dashboard',
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <Home /> },
    // ... other dashboard sub-routes
  ],
};

export default dashboardRoutes;
