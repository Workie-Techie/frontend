import { useDispatch, useSelector } from 'react-redux';
import { setToken, setRefreshToken, setUser, setLoading, setError, clearAuth } from '../store/authState';
import authService, { setAuthToken } from '../services/authService';
import { setProfile } from '../store/authState';
import { useEffect } from 'react';

const API_URL = 'http://localhost:8000';

export const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const login = async (email, password) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const access = await authService.login(email, password);
      dispatch(setToken(access));
      
      // Fetch user details
      await fetchCurrentUser();
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      dispatch(setError(err.response?.data?.detail || 'Invalid credentials'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (userData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await authService.register(userData);
      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        dispatch(setError(errorMessages));
      } else {
        dispatch(setError('Registration failed'));
      }
      dispatch(setLoading(false));
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(clearAuth());
  };

  const fetchCurrentUser = async () => {
    try {
      dispatch(setLoading(true));
      const userData = await authService.fetchCurrentUser();
      dispatch(setUser(userData));
      dispatch(setError(null));
      dispatch(setLoading(false));
      return true;
    } catch (err) {
      console.error('Error fetching user:', err);
      dispatch(setError('Failed to fetch user data'));
      dispatch(setLoading(false));
      return false;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const access = await authService.refreshToken();
      dispatch(setToken(access));
      return true;
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
      return false;
    }
  };

  const activateAccount = async (uid, token) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await authService.activateAccount(uid, token);
      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      console.error('Activation error:', err);
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        dispatch(setError(errorMessages));
      } else {
        dispatch(setError('Activation failed'));
      }
      dispatch(setLoading(false));
      return { success: false };
    }
  };

  const forgotPassword = async (email) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await authService.forgotPassword(email);
      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      console.error('Forgot password error:', err);
      dispatch(setError(err.response?.data || 'Failed to send reset link'));
      dispatch(setLoading(false));
      return false;
    }
  };

  const resetPasswordConfirm = async (uid, token, new_password, re_new_password) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await authService.resetPasswordConfirm(uid, token, new_password, re_new_password);
      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      console.error('Reset password confirm error:', err);
      dispatch(setError(err.response?.data || 'Failed to reset password'));
      dispatch(setLoading(false));
      return false;
    }
  };


const fetchUserProfile = async () => {
  try {
    const profile = await authService.fetchUserProfile();
    dispatch(setProfile(profile));
    return profile;
  } catch (error) {
    dispatch(setError('Failed to load profile'));
    return null;
  }
};


  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    activateAccount,
    forgotPassword,
    resetPasswordConfirm,
    fetchCurrentUser,
    fetchUserProfile,
    updateUserProfile: authService.updateUserProfile,
  };
};

export default useAuth;
