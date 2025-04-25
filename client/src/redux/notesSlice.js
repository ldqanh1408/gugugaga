// src/redux/notesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotes, saveNote, updateNote } from "../services/journalService";
import { addMessage, getMessages } from "../services";

// Thunk để fetch danh sách notes từ API
export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  const data = await getNotes();
  return data; // Trả về danh sách ghi chú
});

// Thunk để lưu note mới
export const saveNewNote = createAsyncThunk(
  "notes/saveNewNote",
  async (newNote) => {
    const savedNote = await saveNote(newNote); // Send flat payload
    return savedNote;
  }
);

// Thunk để update note
export const updateExistingNote = createAsyncThunk(
  "notes/updateExistingNote",
  async (updatedNote) => {
    const savedNote = await updateNote(updatedNote);
    return savedNote;
  }
);

const getVietnamDate = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7);  // Thêm 7 giờ để chuyển từ UTC sang GMT+7
  return now.toISOString().split("T")[0];  // Lấy phần ngày (YYYY-MM-DD)
};

// Slice Redux để quản lý trạng thái notes
const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    updateMode: false,
    loading: false,
    error: null,
    currentIndex: null,
    currentNote: {
      header: "",
      date: getVietnamDate(),
      text: "",
      mood: "neutral",
      media: [], // <-- Thêm chỗ này để chứa media
    },
  },
  reducers: {
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
      state.currentNote = state.notes[state.currentIndex] || {
        header: "",
        date: new Date().toISOString().split("T")[0],
        text: "",
        mood: "neutral",
        media: [],
      }; // Nếu không có ghi chú nào, tạo note trắng trống
    },
    setCurrentNote: (state, action) => {
      // Thiết lập currentNote trực tiếp từ payload
      state.currentNote = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    setTemporaryNote: (state) => {
      // Thiết lập một note trắng khi chưa có ghi chú nào được chọn
      state.currentIndex = null;
      state.currentNote = {
        header: "",
        date: new Date().toISOString().split("T")[0],
        text: "",
        mood: "neutral",
        media: [],
      };
      state.isEditing = true; // Tự động bật chế độ edit
    },
    addMediaToCurrentNote: (state, action) => {
      const { type, url, name } = action.payload;
      if (!state.currentNote.media) {
        state.currentNote.media = [];
      }
      state.currentNote.media = [...state.currentNote.media, { type, url, name }];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loading = false;

        // Nếu chưa có note nào thì đặt một ghi chú trắng
      
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(saveNewNote.fulfilled, (state, action) => {
        state.notes.push(action.payload); // Add the new note to the notes array
        state.currentIndex = state.notes.length - 1; // Set currentIndex to the new note
        state.currentNote = action.payload; // Update currentNote to the new note
        state.isEditing = false; // Exit editing mode
        console.log("New note saved with ID:", action.payload._id); // Debugging log
      })
      .addCase(updateExistingNote.fulfilled, (state, action) => {
        state.notes = state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
        state.isEditing = false; // Thoát khỏi chế độ edit sau khi update
      });
  },
});

export const { setCurrentIndex, setIsEditing, setCurrentNote, addMediaToCurrentNote } =
  notesSlice.actions;
export default notesSlice.reducer;
