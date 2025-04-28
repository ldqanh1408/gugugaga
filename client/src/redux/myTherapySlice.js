import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const myTherapySlice = createSlice({
  name: "myTherapy",
  initialState: {
    isViewing: false,
    status: "current",
  },
  reducers: {
    setIsViewing : (state, action) => {
        state.isViewing = action.payload
    },
    setStatus : (state, action) => {
        state.status = action.payload
    }
  },
  
});

export const {setIsViewing, setStatus} = myTherapySlice.actions
export default myTherapySlice.reducer;
