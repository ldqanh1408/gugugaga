import { createSlice } from '@reduxjs/toolkit';

const initialFont = localStorage.getItem('selectedFont') || 'Roboto'; // Lấy font từ localStorage nếu có, nếu không sẽ là 'Roboto'

const fontSlice = createSlice({
  name: 'font',
  initialState: {
    selectedFont: initialFont, // Font mặc định
  },
  reducers: {
    setFont: (state, action) => {
      state.selectedFont = action.payload;
      localStorage.setItem('selectedFont', action.payload); // Lưu lại vào localStorage
    },
  },
});

export const { setFont } = fontSlice.actions;
export default fontSlice.reducer;
