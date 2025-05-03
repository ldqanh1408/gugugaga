import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBookings,
  getTreaments,
  receiveBooking,
} from "../services/expertService";
import { acceptTreatment, getAverageRating, rejectTreatment } from "../services/treatmentService";
import { updateTreatment } from "../services/expertService";

export const getTreatmentsThunk = createAsyncThunk(
  "experts/getTreaments",
  async (payload) => {
    const data = await getTreaments(payload);
    return data?.data;
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

export const updateTreatmentThunk = createAsyncThunk(
  "expert/updateTreatment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateTreatment(payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getBookingsThunk = createAsyncThunk(
  "expert/getBookings",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await getBookings(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const receiveBookingThunk = createAsyncThunk(
  "expert/receiveBooking",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await receiveBooking(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getAverageRatingThunk = createAsyncThunk(
  "expert/getAverageRating",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await getAverageRating(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue( 
        error.response ? error.response.data : error.message
      );
    }
  }
);

const expertSlice = createSlice({
  name: "expert",
  initialState: {
    expert: null, // Dữ liệu user cơ bản
    profile: null, // Dữ liệu profile chi tiết
    loading: false,
    profileLoading: false, // Loading riêng cho profile
    error: null,
    logoutLoading: false,
    logoutError: null,
    treatments: [],
    currentTreatments: [],
    pendingTreatments: [],
    seletedTreatment: null,
    isViewing: false,
    bookings: [],
    status: "pending",
    averageRating: 0,
  },
  reducers: {
    setSelectedTreatment: (state, action) => {
      state.selectedTreatment = action.payload;
    },
    setIsViewing: (state, action) => {
      state.isViewing = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setAverageRating: (state, action) => {
      state.averageRating = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getTreatmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTreatmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.treatments = action.payload || [];
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
      })
      .addCase(updateTreatmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTreatmentThunk.fulfilled, (state, action) => {
        const { treatment_id, data } = action.meta.arg; // lấy từ payload truyền vào thunk
        state.loading = false;

        // Cập nhật treatment đang xem
        if (
          state.selectedTreatment &&
          state.selectedTreatment._id === treatment_id
        ) {
          state.selectedTreatment.summary = data.rating;
        }

        // Cập nhật trong danh sách treatment
        state.treatments = state.treatments.map((t) =>
          t._id === treatment_id
            ? {
                ...t,
                summary: data.summary,
              }
            : t
        );

        state.currentTreatments = state.treatments.filter(
          (t) => t.treatmentStatus !== "pending"
        );

        state.pendingTreatments = state.treatments.filter(
          (t) => t.treatmentStatus === "pending"
        );
      })

      .addCase(updateTreatmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update treatment";
      })
      .addCase(getBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(receiveBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(receiveBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBooking = action.payload;
        // Cập nhật booking tương ứng trong danh sách bookings
        const index = state.bookings.findIndex(
          (b) => b?._id === updatedBooking?._id
        );

        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
      })
      .addCase(receiveBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAverageRatingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageRatingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.averageRating = action.payload?.average_rating || 0;
      })
      .addCase(getAverageRatingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedTreatment, setIsViewing, setStatus } =
  expertSlice.actions;
export default expertSlice.reducer;
