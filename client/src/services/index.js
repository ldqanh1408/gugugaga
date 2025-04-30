import {
  getUsers,
  getUserById,
  addUser,
  getUser,
  getAvatar,
  uploadAvatar,
  loadProfile,
  uploadProfile,
} from "./userService.js";
import {
  handleLogin,
  handleFocus,
  handleBlur,
  handleConfirm,
} from "./validationService.js";

import { getMessages, addMessage } from "./chatService.js";
import {
  getToken,
  logout,
  getPayLoad,
  logging,
  register,
  changePassword,
} from "./authService.js";
import { getNotes, getEntries, getConsecutiveDays } from "./journalService.js";

export const addFutureMail = async (userId, mailData) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `http://localhost:5000/api/v1/users/${userId}/future-mails`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(mailData),
      }
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to add future mail");
    }
    return data;
  } catch (error) {
    console.error("Error adding future mail:", error);
    throw error;
  }
};

export const getFutureMails = async (userId) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }

    const response = await fetch(
      `http://localhost:5000/api/v1/users/${userId}/future-mails`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Không thể lấy danh sách thư");
    }

    return data.futureMails || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thư:", error);
    return [];
  }
};

export {
  getNotes,
  getUsers,
  getUser,
  addUser,
  handleFocus,
  handleBlur,
  handleLogin,
  handleConfirm,
  getMessages,
  addMessage,
  getToken,
  logout,
  getPayLoad,
  logging,
  register,
  changePassword,
  getAvatar,
  uploadAvatar,
  loadProfile,
  uploadProfile,
  getEntries,
  getConsecutiveDays,
};
