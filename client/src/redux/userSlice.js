import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUser,
  logout,
  loadProfile,
  uploadProfile,
  getEntries,
  getConsecutiveDays
} from "../services"; // API services
import { getTreaments } from "../services/userService";

// Thunk lấy user cơ bản (thông tin đăng nhập)
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (payload, thunkAPI) => {
    try {
      const response = await getUser();
      return response; // Trả về dữ liệu user cơ bản
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk lấy thông tin profile chi tiết (nickName, bio, avatar)
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const profile = await loadProfile(); // Giả sử đây là API profile
      return profile; // Trả về dữ liệu profile chi tiết
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk xử lý logout
export const logoutUserAsync = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      await logout();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk xử lý API upload profile (gửi dữ liệu lên server)
export const uploadProfileAsync = createAsyncThunk(
  "user/uploadProfile",
  async ({ profile, avatarFile }, thunkAPI) => {
    try {
      // Gửi request upload profile và file avatar
      const response = await uploadProfile({ profile, avatarFile });
      return response.profile; // Trả về profile từ server sau khi update thành công
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // Xử lý lỗi khi upload thất bại
    }
  }
);

export const fetchEntries = createAsyncThunk(
  "user/fetchEntries",
  async (_, { rejectWithValue }) => {
    try {
      const entries = await getEntries();
      return entries;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchConsecutiveDays = createAsyncThunk(
  "user/fetchConsecutiveDays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConsecutiveDays();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getTreatmentsThunk = createAsyncThunk(
  "users/getTreaments",
  async (payload) => {
    const data = await getTreaments();
    return data?.treatments;
  }
);
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // Dữ liệu user cơ bản
    profile: null, // Dữ liệu profile chi tiết
    loading: false,
    profileLoading: false, // Loading riêng cho profile
    error: null,
    logoutLoading: false,
    logoutError: null,
    entries: 0,
    consecutiveDays: 0,
    treatments: [],
    currentTreatments: [],
    pendingTreatments: [],
  },
  reducers: {
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload; // Cập nhật avatar đồng bộ
      }
      if (state.profile) {
        state.profile.avatar = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsecutiveDays.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConsecutiveDays.fulfilled, (state, action) => {
        state.loading = false;
        state.consecutiveDays = action.payload;
      })
      .addCase(fetchConsecutiveDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = "false";
        state.error = action.payload;
      })
      // Fetch User (thông tin cơ bản)
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload; // Lưu thông tin user cơ bản
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch user";
        state.loading = false;
      })

      // Fetch Profile (thông tin chi tiết)
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload; // Lưu thông tin profile chi tiết
        state.profileLoading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.profileLoading = false;
      })

      // Logout
      .addCase(logoutUserAsync.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.user = null;
        state.profile = null; // Xóa cả thông tin profile khi logout
        state.logoutLoading = false;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.logoutError = action.payload || "Failed to logout";
        state.logoutLoading = false;
      })

      .addCase(uploadProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileAsync.fulfilled, (state, action) => {
        state.profile = action.payload; // Lưu dữ liệu profile trả về từ server
        state.user = { ...state.user, avatar: action.payload.avatar };
        state.loading = false;
      })
      .addCase(uploadProfileAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to update profile"; // Xử lý lỗi khi thất bại
        state.loading = false;
      })
      .addCase(getTreatmentsThunk.pending, (state) => {
        state.loading = true;
        state.treatments = [];
        state.error = null;
      })
      .addCase(getTreatmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.treatments = action.payload;
        state.currentTreatments = action.payload?.filter((treatment, index) => treatment.treatmentStatus !== "pending");
        state.pendingTreatments = action.payload?.filter((treatment, index) => treatment.treatmentStatus === "pending");
        state.error = null;
      })
      .addCase(getTreatmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateAvatar } = userSlice.actions; // Action để đồng bộ avatar

export default userSlice.reducer;
