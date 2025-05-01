import axios from "axios";
import { getPayLoad, getToken } from "./authService";
const API_URL = "http://localhost:5000/api";
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const addExpert = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/experts`;
    const response = await api.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const uploadImg = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const formData = new FormData();
    formData.append("image", payload.file); // 'file' phải khớp với field multer backend nhận
    formData.append("type", payload.type); // 'file' phải khớp với field multer backend nhận

    const url = `/v1/upload`;
    const response = await api.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // QUAN TRỌNG
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteExpert = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/business/me/experts/${payload.expert_id}`;
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateExpert = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/business/me/experts/${payload.expert_id}`;
    const response = await api.patch(url,payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getComplaints = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/business/me/complaints`;
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
