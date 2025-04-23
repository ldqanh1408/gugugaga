import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    isViewing: false,
  },
  reducers: {
    setIsViewing : (state, action) => {
        state.isViewing = action.payload
    }
  },
  
});

export const {setIsViewing} = scheduleSlice.actions
export default scheduleSlice.reducer;
