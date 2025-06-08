import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, register, logging } from "../services/";
import { act } from "react";
// Tạo Thunk để kiểm tra token
export const checkToken = createAsyncThunk(
  "auth/checkToken",
  async (_, thunkAPI) => {
    try {
      const accessToken = await getToken(); // Gọi API lấy token
      return accessToken; // Nếu có token thì trả về
    } catch (error) {
      return thunkAPI.rejectWithValue(null); // Nếu lỗi, trả về null
    }
  }
);

// Thunk cho đăng ký
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await register(data);
      console.log(res);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loggingThunk = createAsyncThunk(
  "auth/logging",
  async (data, { rejectWithValue }) => {
    try {
      const response = await logging(data);

      return response;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.response?.data?.message || "Logging failed");
    }
  }
);

const entity = JSON.parse(localStorage.getItem("entity"));
const accessToken = JSON.parse(localStorage.getItem("accessToken"))?.replace(/"/g, "");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    entity: entity || null,
    accessToken: accessToken || null,
    isAuthenticated: !!entity || false,
    loading: false,
    role: entity?.role,
    tempRole: "USER",
  },
  reducers: {
    setTempRole: (state, action) => {
      state.tempRole = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.entity = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.role = "USER";
      localStorage.removeItem("entity");
      localStorage.removeItem("accessToken");
    },
  },
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
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.entity = action?.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(loggingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.isAuthenticated = false;
      })
      .addCase(loggingThunk.fulfilled, (state, action) => {
        const entity = action?.payload?.data?.data;
        const token = action?.payload?.data?.accessToken;
        console.warn(entity)
        state.loading = false;
        state.success = true;
        state.isAuthenticated = true;
        state.role = entity?.role || "USER";
        state.entity = entity;
        state.accessToken = token;
        localStorage.setItem("entity", JSON.stringify(entity));
        localStorage.setItem("accessToken", JSON.stringify(token));
      })
      .addCase(loggingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.isAuthenticated = false;
      });
  },
});
export const { setRole, setIsAuthenticated, setTempRole, logout } = authSlice.actions;
export default authSlice.reducer;
