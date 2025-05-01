import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const complaintSlice = createSlice({
  name: "complaint",
  initialState: {
    loading: false,
    profileLoading: false, // Loading riêng cho profile
    error: null,
    logoutLoading: false,
    logoutError: null,
    treatments: [],
    selectedTreatment: null,
    isViewing: false, // 👈 thêm
  },

  reducers: {
    setIsViewing: (state, action) => {
      state.isViewing = action.payload;
    },
  },
  extraReducers: (builder) => {
     
  },
});
export const {setIsViewing} = complaintSlice.actions;
export default complaintSlice.reducer;