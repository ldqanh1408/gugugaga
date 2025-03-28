// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from "./authSlice"; // Import reducer

export const store = configureStore({
  reducer: {
    user: userReducer, // Thêm reducer user vào store
    auth: authReducer, // Thêm reducer auth vào store

  },
});