import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';
import { tokenState, refreshTokenState, userState, authLoadingState, authErrorState, isAuthenticatedState, setAuthHeader } from '../store/authState';

export const useAuth = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(authLoadingState);
  const [error, setError] = useRecoilState(authErrorState);
  const isAuthenticated = useRecoilValue(isAuthenticatedState);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/auth/jwt/create/', { email, password });
      const { access, refresh } = response.data;
      
      // Store tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Update state
      setToken(access);
      setRefreshToken(refresh);
      setAuthHeader(access);
      
      // Fetch user details
      await fetchCurrentUser();
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid credentials');
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/auth/users/', userData);
      
      // // Auto login after registration
      // const loginSuccess = await login(userData.email, userData.password);
      // return loginSuccess;
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setError(errorMessages);
      } else {
        setError('Registration failed');
      }
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setAuthHeader(null);
  };

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/');
      setUser(response.data);
      setError(null);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user data');
      setLoading(false);
      return false;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/auth/jwt/refresh/', { refresh: refreshToken });
      const { access } = response.data;
      
      localStorage.setItem('token', access);
      setToken(access);
      setAuthHeader(access);
      
      return true;
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
      return false;
    }
  };

  const activateAccount = async (uid, token) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/auth/users/activation/', { uid, token });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Activation error:', err);
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setError(errorMessages);
      } else {
        setError('Activation failed');
      }
      setLoading(false);
      return { success: false };
    }
  };
  

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAccessToken,
    activateAccount,
  };
};