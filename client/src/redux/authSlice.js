import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../services/";

// Tạo Thunk để kiểm tra token
export const checkToken = createAsyncThunk("auth/checkToken", async (_, thunkAPI) => {
  try {
    const token = await getToken(); // Gọi API lấy token
    return token; // Nếu có token thì trả về
  } catch (error) {
    return thunkAPI.rejectWithValue(null); // Nếu lỗi, trả về null
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkToken.pending, (state) => {
        state.loading = true; // Đang xử lý kiểm tra token
      })
      .addCase(checkToken.fulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload; // Nếu có token hợp lệ thì là authenticated
        state.loading = false;
      })
      .addCase(checkToken.rejected, (state) => {
        state.isAuthenticated = false; // Nếu token không hợp lệ hoặc lỗi
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
