import axios from "axios";
import { getPayLoad, getToken } from "./authService";
const API_URL = "http://localhost:5000/api/v1/chats/";

export const getMessages = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("Không tìm thấy token");
  }
  try {
    const entity = JSON.parse(localStorage.getItem("entity"));
    const { chatId } = entity;
    if (!chatId) {
      throw new Error("Chat ID không tồn tại");
    }
    const url = `${API_URL}${chatId}/messages`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data.messages;
  } catch (error) {
    console.error(
      "Error fetching notes:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const addMessage = async (newMessage) => {
  const token = await getToken();
  if (!token) {
    throw new Error("Không tìm thấy token");
  }
  try {
    const entity = JSON.parse(localStorage.getItem("entity"));
    const { chatId } = entity;
    if (!chatId) {
      throw new Error("Chat ID không tồn tại");
    }

    // Ensure media is an array and has correct format
    const message = {
      ...newMessage.message,
      media: Array.isArray(newMessage.message.media) ? newMessage.message.media : []
    };

    const url = `${API_URL}${chatId}/messages`;
    const response = await axios.post(url, { message }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
