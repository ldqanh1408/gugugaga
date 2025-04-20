import axios from "axios";
import { getPayLoad, getToken } from "./authService";
const API_URL = "http://localhost:5000/api";
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
export const getAvailableExpert = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
        throw new Error("Không tìm thấy token");
    }
    const url = `/v1/experts/available`;
    const response = await api.post(url,payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    console.log(response);
    return response.data
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
