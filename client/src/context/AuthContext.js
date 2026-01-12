import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginAPI, register as registerAPI, checkUserStatus as checkUserStatusAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suspensionAlert, setSuspensionAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) return;

    const checkSuspensionStatus = async () => {
      try {
        const response = await checkUserStatusAPI();
        // If it succeeds and we had an alert, clear it
        if (suspensionAlert) setSuspensionAlert(null);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          const data = error.response.data;
          if (data.message === 'Account suspended') {
            setSuspensionAlert({
              reason: data.reason,
              suspendedAt: data.suspendedAt
            });
          }
        } else if (error.response && error.response.status === 401) {
          // Token expired or invalid
          logout();
        } else {
          console.error('Failed to check suspension status:', error);
        }
      }
    };

    const suspensionCheckInterval = setInterval(checkSuspensionStatus, 5000);
    return () => clearInterval(suspensionCheckInterval);
  }, [user]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await loginAPI({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerAPI(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSuspensionAlert(null);
  };

  const forceLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const updateUserProfilePicture = (profilePictureUrl) => {
    if (user) {
      const updatedUser = { ...user, profilePicture: profilePictureUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    error,
    suspensionAlert,
    setSuspensionAlert,
    login,
    register,
    logout,
    forceLogout,
    updateUserProfilePicture,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
