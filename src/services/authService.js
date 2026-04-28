import axios from "axios";

export const API_URL = "http://localhost:8000";

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
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setAuthToken(null);
  },
};

export default authService;
