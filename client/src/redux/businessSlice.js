import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getExperts } from "../services/expertService";
import { addExpert } from "../services/businessService";

export const getExpertsThunk = createAsyncThunk(
  "business/getExperts",
  async (payload) => {
    const res = await getExperts();
    return res.experts;
  }
);

export const addExpertThunk = createAsyncThunk(
  "business/addExpert",
  async (payload) => {
    const res = await addExpert(payload);
    return res.expert;
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState: {
    business: null, // Dữ liệu user cơ bản
    profile: null, // Dữ liệu profile chi tiết
    loading: false,
    profileLoading: false, // Loading riêng cho profile
    error: null,
    logoutLoading: false,
    logoutError: null,
    treatments: [],
    experts: [],
    isAddView: false,
    isViewDetail: false, // 👈 thêm
    selectedExpert: null, // 👈 thêm
  },

  reducers: {
    setIsAddView: (state, action) => {
      state.isAddView = action.payload;
    },
    setIsViewDetail: (state, action) => {
      state.isViewDetail = action.payload.status;
      state.selectedExpert = action.payload.expert || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpertsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpertsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.experts = action.payload;
      })
      .addCase(getExpertsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExpertThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpertThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.experts.push(action.payload); // Thêm expert mới vào danh sách
      })
      .addCase(addExpertThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsAddView, setIsViewDetail } = businessSlice.actions;
export default businessSlice.reducer;
