import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Set base URL for all axios requests
axios.defaults.baseURL = API_URL;

// Function to set auth token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize with token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/jwt/create/', { email, password });
      const { access, refresh } = response.data;
      
      // Store tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Set auth header
      setAuthToken(access);
      
      return access;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/users/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  fetchCurrentUser: async () => {
    try {
      const response = await axios.get('/api/user/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
  },
  
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await axios.post('/auth/jwt/refresh/', { refresh: refreshToken });
      const { access } = response.data;
      
      localStorage.setItem('token', access);
      setAuthToken(access);
      
      return access;
    } catch (error) {
      throw error;
    }
  },
  activateAccount: async (uid, token) => {
    try {
      const response = await axios.post('/auth/users/activation/', { uid, token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await axios.post('/auth/users/reset_password/', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  resetPasswordConfirm: async (uid, token, new_password, re_new_password) => {
    try {
      const response = await axios.post('/auth/users/reset_password_confirm/', { uid, token, new_password, re_new_password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // services/authService.js
fetchUserProfile: async () => {
  try {
    const response = await axios.get('/api/profile/');
    return response.data;
  } catch (error) {
    throw error;
  }
},

updateUserProfile: async (profileData) => {
  try {
    const response = await axios.patch('/api/profile/', profileData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},

};

export default authService;
