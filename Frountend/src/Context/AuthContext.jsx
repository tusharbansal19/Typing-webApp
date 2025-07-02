// src/AuthContext.js
import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout } from '../features/user/userSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken, user } = useSelector((state) => state.user);

  const login = (payload) => {
    dispatch(loginUser(payload));
  };

  const logoutUser = () => {
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
