// src/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageLoader from './PageLoader';

const ComppProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthLoading = useSelector((state) => state.user.isAuthLoading);
  const location = useLocation();

  // Wait for auth check to complete
  if (isAuthLoading) return <PageLoader />;

  if (isAuthenticated) return <>{children}</>;

  // Save the current location they were trying to access
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export const DashBoardProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthLoading = useSelector((state) => state.user.isAuthLoading);
  const location = useLocation();

  // Wait for auth check to complete
  if (isAuthLoading) return <PageLoader />;

  if (isAuthenticated) return <>{children}</>;

  // Save the current location they were trying to access
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default ComppProtect;
