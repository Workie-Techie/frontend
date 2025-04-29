import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000';  // Update this for production

  // Set axios defaults
  axios.defaults.baseURL = API_URL;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
  }

  // Get current user details if token exists
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/user/');
      setCurrentUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err.response && err.response.status === 401) {
        // Token expired or invalid
        logout();
      }
      setError('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post('/auth/jwt/create/', { username, password });
      const { access, refresh } = response.data;
      
      // Store tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Update state
      setToken(access);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `JWT ${access}`;
      
      // Fetch user details
      await fetchCurrentUser();
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid credentials');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.post('/auth/users/', userData);
      
      // Auto login after registration
      const loginSuccess = await login(userData.username, userData.password);
      return loginSuccess;
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setError(errorMessages);
      } else {
        setError('Registration failed');
      }
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await axios.post('/auth/jwt/refresh/', { refresh: refreshToken });
      const { access } = response.data;
      
      localStorage.setItem('token', access);
      setToken(access);
      axios.defaults.headers.common['Authorization'] = `JWT ${access}`;
      
      return true;
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
      return false;
    }
  };

  const value = {
    currentUser,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};