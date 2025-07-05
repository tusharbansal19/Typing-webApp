// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ComppProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  if (isAuthenticated) return <>{children}</>;
  return <Navigate to="/login" />;
};

 export const DashBoardProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  if (isAuthenticated) return <>{children}</>;
  return <Navigate to="/login" />;
};

export default ComppProtect;
