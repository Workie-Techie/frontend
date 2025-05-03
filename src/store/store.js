import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authState';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
