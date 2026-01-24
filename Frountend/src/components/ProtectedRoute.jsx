// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageLoader from './PageLoader';

const ComppProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthLoading = useSelector((state) => state.user.isAuthLoading);

  // Wait for auth check to complete
  if (isAuthLoading) return <PageLoader />;

  if (isAuthenticated) return <>{children}</>;
  return <Navigate to="/login" />;
};

export const DashBoardProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthLoading = useSelector((state) => state.user.isAuthLoading);

  // Wait for auth check to complete
  if (isAuthLoading) return <PageLoader />;

  if (isAuthenticated) return <>{children}</>;
  return <Navigate to="/login" />;
};

export default ComppProtect;
