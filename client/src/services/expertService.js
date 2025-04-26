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
    const response = await api.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    console.log(response, "response");
    return response.data;
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getTreaments = async (payload) => {  
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/experts/me/treatments`;
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    response.data.data.map((t) => console.log(t.business_id))
    return response.data;
  } catch (error) {
    console.error(
      "Error experts:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getExperts = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    const url = `/v1/experts`;
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
};

export const updateTreatment = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/v1/experts/me/treatments/${payload.treatment_id}`;
    const response = await api.patch(url, payload.data, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getBookings = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/v1/experts/bookings`;
    const response = await api.get(url,{
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};


