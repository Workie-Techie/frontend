import { useCallback, useEffect } from "react";
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

  const fetchCurrentUser = useCallback(async ({ force = false } = {}) => {
    if (!force && auth.user) {
      return auth.user;
    }
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
  }, [auth.user, dispatch]);

  const fetchProfile = useCallback(async ({ force = false } = {}) => {
    if (!force && auth.profile) {
      return auth.profile;
    }
    const profile = await profileService.getProfile();
    dispatch(setProfile(profile));
    return profile;
  }, [auth.profile, dispatch]);

  const bootstrapAuth = useCallback(async ({ tokenOverride = null, force = false } = {}) => {
    const activeToken = tokenOverride || auth.token;
    if (!activeToken) return null;
    try {
      const [user, profile] = await Promise.all([
        fetchCurrentUser({ force }),
        fetchProfile({ force }),
      ]);
      return { user, profile };
    } catch (error) {
      return null;
    }
  }, [auth.token, fetchCurrentUser, fetchProfile]);

  const login = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const tokens = await authService.login(email, password);
      dispatch(setToken(tokens.access));
      dispatch(setRefreshToken(tokens.refresh));
      const bootstrapped = await bootstrapAuth({ tokenOverride: tokens.access, force: true });
      return bootstrapped?.user || true;
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

  const activateAccount = async (uid, token) => {
    dispatch(setLoading(true));
    try {
      await authService.activateAccount(uid, token);
      dispatch(setError(null));
      return { success: true };
    } catch (error) {
      const detail = error.response?.data?.detail || "";
      const tokenLooksUsed = /stale|invalid|not found|expired/i.test(detail);
      dispatch(setError(tokenLooksUsed ? null : detail || "Activation failed. Please request a new activation link."));
      return { success: tokenLooksUsed, alreadyActivated: tokenLooksUsed };
    } finally {
      dispatch(setLoading(false));
    }
  };
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
