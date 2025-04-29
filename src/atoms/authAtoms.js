import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: true,
});

export const tokenState = atom({
  key: 'tokenState',
  default: localStorage.getItem('token') || null,
});

export const authLoadingState = atom({
  key: 'authLoadingState',
  default: true,
});

export const authErrorState = atom({
  key: 'authErrorState',
  default: null,
});