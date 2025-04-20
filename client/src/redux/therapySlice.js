import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAvailableExpert } from "../services/expertService";
import { requestTreatment } from "../services/treatmentService";
export const fetchAvailableExperts = createAsyncThunk(
  "therapy/fetchAvailableExperts",
  async (payload, thunkAPI) => {
    const data = await getAvailableExpert(payload);
    return data.experts;
  }
);

export const requestTreatmentThunk = createAsyncThunk(
  "therapy/booking",
  async (payload, thunkAPI) => {
    console.log(1)
    const data = await requestTreatment(payload);
    return data;
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
      });
  },
});

export const { setDuration, setStartTime, setSelected } = therapySlice.actions;
export default therapySlice.reducer;
