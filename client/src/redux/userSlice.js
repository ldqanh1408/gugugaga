import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUser,
  loadProfile,
  uploadProfile,
  addFutureMail,
  getFutureMails,
  getTodayMails,
  markMailNotified,
  getTreaments,
  updateTreatment,
} from "../services/userService";
import { logout } from "../services/authService";
import { getEntries, getConsecutiveDays } from "../services/journalService";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (payload, thunkAPI) => {
    try {
      const response = await getUser();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const res = await loadProfile();
      console.log("res", res);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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

export const uploadProfileAsync = createAsyncThunk(
  "user/uploadProfile",
  async ({ profile, avatarFile }, thunkAPI) => {
    try {
      const response = await uploadProfile({ profile, avatarFile });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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

export const addFutureMailAsync = createAsyncThunk(
  "user/addFutureMail",
  async ({ userId, mailData }, thunkAPI) => {
    try {
      const response = await addFutureMail(userId, mailData);
      return response.futureMail;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchFutureMailsAsync = createAsyncThunk(
  "user/fetchFutureMails",
  async (userId, thunkAPI) => {
    try {
      const futureMails = await getFutureMails(userId);
      return futureMails;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTodayMails = createAsyncThunk(
  "user/fetchTodayMails",
  async (userId, thunkAPI) => {
    try {
      const todayMails = await getTodayMails(userId);
      return todayMails;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const markMailNotifiedAsync = createAsyncThunk(
  "user/markMailNotified",
  async ({ userId, mailId }, thunkAPI) => {
    try {
      const mail = await markMailNotified(userId, mailId);
      return { mailId, mail };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateTreatmentThunk = createAsyncThunk(
  "user/updateTreatment",
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
    user: null,
    profile: JSON.parse(localStorage.getItem("profile")) || null,
    loading: false,
    error: null,
    logoutLoading: false,
    logoutError: null,
    entries: 0,
    consecutiveDays: 0,
    futureMails: [],
    todayMails: [],
    treatments: [],
    currentTreatments: [],
    pendingTreatments: [],
    selectedTreatment: null,
    isViewing: false,
  },
  reducers: {
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
      if (state.profile) {
        state.profile.avatar = action.payload;
      }
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      localStorage.setItem("profile", JSON.stringify(action.payload));
    },
    setIsViewing: (state, action) => {
      state.isViewing = action.payload;
    },
    setSelectedTreatment: (state, action) => {
      state.selectedTreatment = action.payload;
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
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch user";
        state.loading = false;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileLoading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.profileLoading = false;
      })
      .addCase(logoutUserAsync.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
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
        state.profile = action.payload;
        state.user = { ...state.user, avatar: action.payload.avatar };
        state.loading = false;
      })
      .addCase(uploadProfileAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to update profile";
        state.loading = false;
      })
      .addCase(addFutureMailAsync.fulfilled, (state, action) => {
        state.futureMails.push(action.payload);
      })
      .addCase(fetchFutureMailsAsync.fulfilled, (state, action) => {
        state.futureMails = action.payload;
      })
      .addCase(fetchTodayMails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayMails.fulfilled, (state, action) => {
        state.todayMails = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodayMails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch today's mails";
      })
      .addCase(markMailNotifiedAsync.fulfilled, (state, action) => {
        const { mailId, mail } = action.payload;
        state.todayMails = state.todayMails.map((m) =>
          m._id === mailId ? { ...m, notified: mail.notified } : m
        );
        state.futureMails = state.futureMails.map((m) =>
          m._id === mailId ? { ...m, notified: mail.notified } : m
        );
      })
      .addCase(markMailNotifiedAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark mail as notified";
      })
      .addCase(getTreatmentsThunk.pending, (state) => {
        state.loading = true;
        state.treatments = [];
        state.error = null;
      })
      .addCase(getTreatmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.treatments = action.payload;
        state.currentTreatments = action.payload?.filter(
          (treatment) => treatment.treatmentStatus !== "pending"
        );
        state.pendingTreatments = action.payload?.filter(
          (treatment) => treatment.treatmentStatus === "pending"
        );
        state.error = null;
      })
      .addCase(getTreatmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTreatmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTreatmentThunk.fulfilled, (state, action) => {
        const { treatment_id, data } = action.meta.arg;
        state.loading = false;

        if (
          state.selectedTreatment &&
          state.selectedTreatment._id === treatment_id
        ) {
          state.selectedTreatment.rating = data.rating;
          state.selectedTreatment.feedback = data.feedback;
          state.selectedTreatment.complaint = data.complaint;
        }

        state.treatments = state.treatments.map((t) =>
          t._id === treatment_id
            ? {
                ...t,
                rating: data.rating,
                feedback: data.feedback,
                complaint: data.complaint,
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
      });
  },
});

export const { updateAvatar, setIsViewing, setSelectedTreatment, setProfile } =
  userSlice.actions;

export default userSlice.reducer;
