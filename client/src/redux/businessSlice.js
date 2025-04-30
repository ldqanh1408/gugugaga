import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getExperts } from "../services/expertService";
import {
  addExpert,
  uploadImg,
  updateExpert,
  deleteExpert,
  getComplaints,
} from "../services/businessService";

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
    const url = await uploadImg(payload);
    payload.diploma_url = url.data;
    const res = await addExpert(payload);
    return res.data;
  }
);

export const updateExpertThunk = createAsyncThunk(
  "business/updateExpert",
  async (payload) => {
    console.log("Payload", payload);
    if (payload.file) {
      const url = await uploadImg(payload);
      payload.diploma_url = url.data;
    }
    const res = await updateExpert(payload);
    return res.data;
  }
);

export const deleteExpertThunk = createAsyncThunk(
  "business/deleteExpert",
  async (payload) => {
    const res = await deleteExpert(payload);
    return res.data;
  }
);

export const getComplaintsThunk = createAsyncThunk(
  "business/getComplaints",
  async (payload) => {
    const res = await getComplaints(payload);
    return res.data;
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
    complaints: [],
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
      })
      .addCase(deleteExpertThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpertThunk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedExpertId = action.payload._id; // Giả sử server trả về { _id: 'id vừa xóa' }
        state.experts = state.experts.filter(
          (expert) => expert._id !== deletedExpertId
        );
        if (
          state.selectedExpert &&
          state.selectedExpert._id === deletedExpertId
        ) {
          state.selectedExpert = null; // Nếu đang xem chi tiết expert vừa xóa thì clear luôn
          state.isViewDetail = false;
        }
      })
      .addCase(deleteExpertThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExpertThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpertThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedExpert = action.payload;
        const index = state.experts.findIndex(
          (expert) => expert._id === updatedExpert._id
        );
        if (index !== -1) {
          state.experts[index] = updatedExpert; // Cập nhật expert trong mảng
        }
        if (
          state.selectedExpert &&
          state.selectedExpert._id === updatedExpert._id
        ) {
          state.selectedExpert = updatedExpert; // Nếu đang xem chi tiết, cập nhật luôn selectedExpert
        }
      })
      .addCase(updateExpertThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getComplaintsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplaintsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload; // Cập nhật danh sách complaints
      })
      .addCase(getComplaintsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { setIsAddView, setIsViewDetail } = businessSlice.actions;
export default businessSlice.reducer;
