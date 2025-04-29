import { atom, selector } from 'recoil';
import axios from 'axios';

// Base atoms for authentication
export const tokenState = atom({
  key: 'tokenState',
  default: localStorage.getItem('token') || null,
});

export const refreshTokenState = atom({
  key: 'refreshTokenState',
  default: localStorage.getItem('refreshToken') || null,
});

export const userState = atom({
  key: 'userState',
  default: null,
});

export const authLoadingState = atom({
  key: 'authLoadingState',
  default: true,
});

export const authErrorState = atom({
  key: 'authErrorState',
  default: null,
});

// Selectors for authentication
export const isAuthenticatedState = selector({
  key: 'isAuthenticatedState',
  get: ({ get }) => {
    const token = get(tokenState);
    return !!token;
  },
});

// Set axios default headers whenever token changes
export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};