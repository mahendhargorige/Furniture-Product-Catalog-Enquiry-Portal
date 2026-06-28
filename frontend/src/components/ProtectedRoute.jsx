import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('svs_admin_token');

  if (!token) {
    // Redirect to login page and store the source page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
