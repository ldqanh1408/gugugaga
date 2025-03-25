import axios from "axios";
import { getPayLoad, getToken } from "./authService";
const API_URL = "http://localhost:5000/api/v1/chats/";

export const getMessages = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("Không tìm thấy token");
  }
  try {
    const { chatId } = await getPayLoad(); 
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
      const { chatId } = await getPayLoad();
      if (!chatId) {
        throw new Error("Chat ID không tồn tại");
      }
      const url = `${API_URL}${chatId}/messages`;
      const response = await axios.post(url, newMessage, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      console.warn(response.data)
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching notes:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
