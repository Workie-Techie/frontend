import axios from "axios";

import { API_URL } from "../config/api";

export { API_URL };

export const publicApi = axios.create({
  baseURL: API_URL,
});

export const privateApi = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    privateApi.defaults.headers.common.Authorization = `JWT ${token}`;
  } else {
    delete privateApi.defaults.headers.common.Authorization;
  }
};

const storedToken = localStorage.getItem("token");
if (storedToken) {
  setAuthToken(storedToken);
}

let refreshPromise = null;

const emitAuthEvent = (name, detail = {}) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
};

const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  setAuthToken(null);
  emitAuthEvent("workietechie:auth-cleared");
};

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const refresh = localStorage.getItem("refreshToken");

    if (!isUnauthorized || originalRequest?._retry || !refresh) {
      if (isUnauthorized && !refresh) clearStoredAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      refreshPromise =
        refreshPromise ||
        publicApi.post("/auth/jwt/refresh/", { refresh }).finally(() => {
          refreshPromise = null;
        });
      const response = await refreshPromise;
      const access = response.data.access;
      localStorage.setItem("token", access);
      setAuthToken(access);
      emitAuthEvent("workietechie:token-refreshed", { access });
      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `JWT ${access}`,
      };
      return privateApi(originalRequest);
    } catch (refreshError) {
      clearStoredAuth();
      return Promise.reject(refreshError);
    }
  }
);

const authService = {
  login: async (email, password) => {
    const response = await publicApi.post("/auth/jwt/create/", { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
    setAuthToken(access);
    return response.data;
  },

  register: async (payload) => {
    const response = await publicApi.post("/auth/users/", payload);
    return response.data;
  },

  fetchCurrentUser: async () => {
    const response = await privateApi.get("/api/user/");
    return response.data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem("refreshToken");
    const response = await publicApi.post("/auth/jwt/refresh/", { refresh });
    localStorage.setItem("token", response.data.access);
    setAuthToken(response.data.access);
    emitAuthEvent("workietechie:token-refreshed", { access: response.data.access });
    return response.data.access;
  },

  activateAccount: async (uid, token) => {
    const response = await publicApi.post("/auth/users/activation/", { uid, token });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await publicApi.post("/auth/users/reset_password/", { email });
    return response.data;
  },

  resetPasswordConfirm: async (uid, token, new_password, re_new_password) => {
    const response = await publicApi.post("/auth/users/reset_password_confirm/", {
      uid,
      token,
      new_password,
      re_new_password,
    });
    return response.data;
  },

  logout: () => {
    clearStoredAuth();
  },
};

export default authService;
