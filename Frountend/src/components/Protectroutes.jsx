// src/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectLogin = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  // Get the page they were trying to access, or default to home
  const from = location.state?.from || '/';

  // If already authenticated, redirect to their intended destination
  if (isAuthenticated) return <Navigate to={from} replace />;

  return <>{children}</>;
};

export default ProtectLogin;
