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

export const addFutureMail = async (mailData) => {
  // Logic để thêm mail vào cơ sở dữ liệu hoặc localStorage
  console.log("Adding future mail:", mailData);
};

export const getFutureMails = async () => {
  // Logic để lấy danh sách mail từ cơ sở dữ liệu hoặc localStorage
  console.log("Fetching future mails");
  return [];
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
