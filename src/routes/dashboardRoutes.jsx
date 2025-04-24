// src/routes/dashboardRoutes.jsx
import React from 'react';
import PrivateRoute from '../middleware/PrivateRoute'; // Make sure this exists
import DashboardLayout from '../layout/dashbord';
import Home from '../views/dashbord'; 
import Catalog from '../views/dashbord/ProductOfferingCatalog'; 

const dashboardRoutes = {
  path: '/dashboard',
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <Home /> },
    { path: 'catalog', element:<Catalog/>},
    // ... other dashboard sub-routes
  ],
};

export default dashboardRoutes;
