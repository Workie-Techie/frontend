import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import authService, { setAuthToken } from "../services/authService";
import {
  clearAuth,
  setError,
  setLoading,
  setProfile,
  setRefreshToken,
  setToken,
  setUser,
} from "../store/authState";
import profileService from "../services/profileService";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token) {
      setAuthToken(auth.token);
    }
  }, [auth.token]);

  const fetchCurrentUser = async () => {
    dispatch(setLoading(true));
    try {
      const user = await authService.fetchCurrentUser();
      dispatch(setUser(user));
      dispatch(setError(null));
      return user;
    } catch (error) {
      dispatch(setError("Unable to load your account."));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchProfile = async () => {
    const profile = await profileService.getProfile();
    dispatch(setProfile(profile));
    return profile;
  };

  const bootstrapAuth = async () => {
    if (!auth.token) return null;
    try {
      const [user, profile] = await Promise.all([fetchCurrentUser(), fetchProfile()]);
      return { user, profile };
    } catch (error) {
      return null;
    }
  };

  const login = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const tokens = await authService.login(email, password);
      dispatch(setToken(tokens.access));
      dispatch(setRefreshToken(tokens.refresh));
      await bootstrapAuth();
      return true;
    } catch (error) {
      dispatch(setError(error.response?.data?.detail || "Invalid credentials."));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (payload) => {
    dispatch(setLoading(true));
    try {
      await authService.register(payload);
      dispatch(setError(null));
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data &&
        Object.values(error.response.data)
          .flat()
          .join(" ");
      dispatch(setError(errorMessage || "We couldn't create your account."));
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(clearAuth());
  };

  const activateAccount = async (uid, token) => authService.activateAccount(uid, token);
  const forgotPassword = async (email) => authService.forgotPassword(email);
  const resetPasswordConfirm = async (uid, token, newPassword, confirmPassword) =>
    authService.resetPasswordConfirm(uid, token, newPassword, confirmPassword);

  return {
    ...auth,
    login,
    register,
    logout,
    fetchCurrentUser,
    fetchProfile,
    bootstrapAuth,
    activateAccount,
    forgotPassword,
    resetPasswordConfirm,
  };
};

export default useAuth;
