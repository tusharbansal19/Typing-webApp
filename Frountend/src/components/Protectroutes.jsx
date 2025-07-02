// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectLogin = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" />;
  return <>{children}</>;
};

export default ProtectLogin;
