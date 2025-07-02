// src/AuthContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout } from '../features/user/userSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken, user } = useSelector((state) => state.user);

  // On mount, check for token in localStorage and set Redux state if present
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      // Optionally, fetch user info from /user/me here
      // dispatch(fetchUserFromToken(token));
    }
  }, [dispatch, isAuthenticated]);

  const login = (payload) => {
    // payload: { email, password }
    dispatch(loginUser(payload));
  };

  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, accessToken, login, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
