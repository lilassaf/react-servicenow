// src/routes/dashboardRoutes.jsx
import React from 'react';
import DashboardLayout from '../layout/dashbord';
import Home from '../views/dashbord/Dashboard';

const dashboardRoutes = {
  path: '/dashboard',
  element: <DashboardLayout />,
  children: [
    { index: true, element: <Home /> },        // /dashboard
    // ... other dashboard sub-routes
  ],
};

export default dashboardRoutes;