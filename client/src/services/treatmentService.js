import axios from "axios";
import { getPayLoad, getToken } from "./authService";
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const requestTreatment = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/treatments`;
    const response = await api.post(url, payload, {
        headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
        },
    })
    return response.data
  } catch (error) {
    console.error(
        "Error treatment:",
        error.response ? error.response.data : error.message
      );
      throw error;
  }
};

export const acceptTreatment = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/treatments/${payload.treatment_id}/accept`;
    const response = await api.patch(url, {}, {
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

export const rejectTreatment = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/treatments/${payload.treatment_id}/reject`;
    const response = await api.patch(url, {}, {
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