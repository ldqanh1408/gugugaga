// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from "./authSlice"; // Import reducer
import notesSlice from "./notesSlice";
import fontReducer from './fontSlice';
import historyReducer from './historySlice'
import therapyReducer from "./therapySlice"
import expertReducer from "./expertSlice"
import scheduleReducer from "./scheduleSlice"
import businessReducer from "./businessSlice"
import complaintReducer from "./complaintSlice"
import myTherapyReducer from './myTherapySlice';
export const store = configureStore({
  reducer: {
    user: userReducer, // Thêm reducer user vào store
    auth: authReducer, // Thêm reducer auth vào store
    notes: notesSlice,
    font: fontReducer,
    history: historyReducer,
    therapy: therapyReducer,
    expert : expertReducer,
    schedule: scheduleReducer,
    business: businessReducer,
    complaint: complaintReducer,
    MyTherapy: myTherapyReducer
  },
});