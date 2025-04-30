import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAvailableExpert } from "../services/expertService";
import {
  getAverageRating,
  requestTreatment,
} from "../services/treatmentService";
import { getReceivers, createBooking, cancelBooking, getMyBooking, acceptBooking } from "../services/userService";
export const fetchAvailableExperts = createAsyncThunk(
  "therapy/fetchAvailableExperts",
  async (payload, thunkAPI) => {
    const data = await getAvailableExpert(payload);
    return data.experts;
  }
);
export const getAverageRatingThunk = createAsyncThunk(
  "therapy/getAverageRating",
  async (payload, thunkAPI) => {
    const res = await getAverageRating(payload);
    return res.data;
  }
);

export const requestTreatmentThunk = createAsyncThunk(
  "therapy/booking",
  async (payload, thunkAPI) => {
    const data = await requestTreatment(payload);
    console.warn(data);
    return data.data;
  }
);

export const getReceiversThunk = createAsyncThunk(
  "therapy/receivers",
  async (payload, thunkAPI) => {
    const data = await getReceivers(payload);
    return data?.data;
  }
);

export const createBookingThunk = createAsyncThunk(
  "therapy/createBooking",
  async (payload, thunkAPI) => {
    const data = await createBooking(payload);
    return data.data;
  }
);

export const cancelBookingThunk = createAsyncThunk(
  "therapy/cancelBooking",
  async (payload, thunkAPI) => {
    const data = await cancelBooking(payload);
    return data.data;
  }
);

export const getMyBookingThunk = createAsyncThunk(
  "therapy/getMyBooing",
  async (payload, thunkAPI) => {
    const data = await getMyBooking(payload);
    return data.data;
  }
);

export const acceptBookingThunk = createAsyncThunk(
  "therapy/acceptBooking",
  async (payload, thunkAPI) => {
    const data = await acceptBooking(payload);
    console.log(data);
    return data.data;
  }
);

const therapySlice = createSlice({
  name: "therapy",
  initialState: {
    start_time: null,
    duration: null,
    experts: [],
    loading: false,
    error: null,
    selected: null,
    description: "",
    averageRatings: {}, // 🆕
    booking: null,
  },
  reducers: {
    setStartTime: (state, action) => {
      state.start_time = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(requestTreatmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestTreatmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Nếu bạn cần lưu thông tin treatment đã booking thì thêm ở đây
        // state.treatmentInfo = action.payload;
      })
      .addCase(requestTreatmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAvailableExperts.pending, (state) => {
        state.experts = []; // Reset danh sách khi bắt đầu fetch
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableExperts.fulfilled, (state, action) => {
        state.experts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAvailableExperts.rejected, (state, action) => {
        state.experts = [];
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAverageRatingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageRatingThunk.fulfilled, (state, action) => {
        const { _id, average_rating } = action.payload;
        state.averageRatings[_id] = {
          average_rating,
        };
        state.loading = false;
        state.error = null;
      })
      .addCase(getAverageRatingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getReceiversThunk.pending, (state) => {
        state.experts = []; // Reset danh sách khi bắt đầu fetch
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceiversThunk.fulfilled, (state, action) => {
        state.experts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getReceiversThunk.rejected, (state, action) => {
        state.experts = [];
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.booking = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.booking = null;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(cancelBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.booking = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getMyBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookingThunk.fulfilled, (state, action) => {
        state.booking = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMyBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(acceptBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptBookingThunk.fulfilled, (state, action) => {
        state.booking = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(acceptBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setDuration, setStartTime, setSelected, setDescription } =
  therapySlice.actions;
export default therapySlice.reducer;
