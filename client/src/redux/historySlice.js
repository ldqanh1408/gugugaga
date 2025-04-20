import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, register, logging } from "../services/";
import { act } from "react";

const History = createSlice({
  name: "history",
  initialState: {
    isViewing: false,
  },
  reducers: {
    setIsViewing : (state, action) => {
        state.isViewing = action.payload
    }
  },
  
});

export const {setIsViewing} = History.actions
export default History.reducer;
