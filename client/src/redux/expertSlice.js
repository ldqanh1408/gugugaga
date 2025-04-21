import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTreaments } from "../services/expertService";
import { acceptTreatment, rejectTreatment } from "../services/treatmentService";

export const getTreatmentsThunk = createAsyncThunk(
  "experts/getTreaments",
  async (payload) => {
    const data = await getTreaments();
    return data?.treatments;
  }
);

export const acceptTreatmentThunk = createAsyncThunk(
  "experts/acceptTreatment",
  async (payload) => {
    const data = await acceptTreatment(payload);
    return data.treatment;
  }
);

export const rejectTreatmentThunk = createAsyncThunk(
  "experts/rejectTreatment",
  async (payload) => {
    const data = await rejectTreatment(payload);
    return data.treatment;
  }
);
const expertSlice = createSlice({
  name: "expert",
  initialState: {
    user: null, // Dữ liệu user cơ bản
    profile: null, // Dữ liệu profile chi tiết
    loading: false,
    profileLoading: false, // Loading riêng cho profile
    error: null,
    logoutLoading: false,
    logoutError: null,
    treatments: [],
    currentTreatments: [],
    pendingTreatments: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTreatmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTreatmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.treatments = action.payload || [];

        // Phân loại treatments
        state.currentTreatments = state.treatments.filter(
          (t) => t.treatmentStatus !== "pending"
        );
        state.pendingTreatments = state.treatments.filter(
          (t) => t.treatmentStatus === "pending"
        );
      })
      .addCase(getTreatmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(acceptTreatmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptTreatmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTreatment = action.payload;

        // Cập nhật treatment tương ứng trong danh sách treatments
        const index = state.treatments.findIndex(
          (t) => t._id === updatedTreatment._id
        );

        if (index !== -1) {
          state.treatments[index] = updatedTreatment;
        }

        // Cập nhật lại current và pending
        state.currentTreatments = state.treatments.filter(
          (t) => t.treatmentStatus !== "pending"
        );
        state.pendingTreatments = state.treatments.filter(
          (t) => t.treatmentStatus === "pending"
        );
      })
      .addCase(acceptTreatmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(rejectTreatmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectTreatmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTreatment = action.payload;

        // Cập nhật treatment tương ứng trong danh sách treatments
        const index = state.treatments.findIndex(
          (t) => t._id === updatedTreatment._id
        );

        if (index !== -1) {
          state.treatments[index] = updatedTreatment;
        }

        // Cập nhật lại current và pending
        state.currentTreatments = state.treatments.filter(
          (t) => t.treatmentStatus !== "pending"
        );
        state.pendingTreatments = state.treatments.filter(
          (t) => t.treatmentStatus === "pending"
        );
      })
      .addCase(rejectTreatmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default expertSlice.reducer;
