// src/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import authRoutes from './routes/authRoutes';

const router = createBrowserRouter([
  ...authRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;
