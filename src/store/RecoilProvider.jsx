import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil';
import axios from 'axios';
import { tokenState, refreshTokenState, userState, authLoadingState, authErrorState, setAuthHeader } from './authState';

// Initialize API settings
const API_URL = 'http://localhost:8000';
axios.defaults.baseURL = API_URL;

// Inner component to perform initialization
const AuthInitializer = ({ children }) => {
  const [token, setToken] = useRecoilState(tokenState);
  const setUser = useSetRecoilState(userState);
  const setLoading = useSetRecoilState(authLoadingState);
  const setError = useSetRecoilState(authErrorState);

  // Initialize auth header and fetch user if token exists
  useEffect(() => {
    if (token) {
      setAuthHeader(token);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/');
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err.response && err.response.status === 401) {
        // Token expired or invalid
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setAuthHeader(null);
      }
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  return children;
};

// Main RecoilProvider that wraps the app
const AppRecoilProvider = ({ children }) => {
  return (
    <RecoilRoot>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </RecoilRoot>
  );
};

export default AppRecoilProvider;