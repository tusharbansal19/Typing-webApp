// src/AuthContext.js
import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../features/user/userSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get user info from Redux
  const user = useSelector((state) => state.user.user);
  const email = useSelector((state) => state.user.email);
  const token = useSelector((state) => state.user.accessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  // Prefer user.email and user.displayName if available
  const userEmail = user?.email || email || '';
  const userName = user?.displayName || user?.username || user?.name || '';

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ userEmail, userName, token, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
