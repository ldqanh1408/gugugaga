import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, register, logging } from "../services/";
import { act } from "react";

const History = createSlice({
  name: "history",
  initialState: {
    isViewing: false,
    selectedTreatment: null,
  },
  reducers: {
    setIsViewing : (state, action) => {
        state.isViewing = action.payload
    },
    setSelectedTreatment : (state, action) => {
        state.selectedTreatment = action.payload
    }
  },
  
});

export const {setIsViewing, setSelectedTreatment} = History.actions
export default History.reducer;
