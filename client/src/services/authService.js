import api from "./api";
import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getPayLoad = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const logging = async (payload) => {
  try {
    const response = await api.post("/v1/auth/login", payload);
    if (response.data.success) {
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      return {
        success: true,
        decoded,
        message: response.data.message,
      };
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Đăng nhập thất bại",
    };
  }
};

export const register = async (payload) => {
  try {
    const response = await api.post("/v1/auth/register", payload);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Đăng ký thất bại",
    };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
};

export const changePassword = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không tìm thấy token" };
    }

    const response = await api.post("/v1/auth/change-password", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Đổi mật khẩu thất bại",
    };
  }
};
