import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/v1";
const API_URL_V2 = "http://localhost:5000/api/v2";
const API_URL_V3 = "http://localhost:5000/api/v3";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const api_v2 = axios.create({
  baseURL: API_URL_V2,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const api_v3 = axios.create({
  baseURL: API_URL_V3,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const getToken = () => {
  // Ưu tiên accessToken nếu có
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    try {
      return JSON.parse(accessToken);
    } catch (error) {
      console.error("Invalid accessToken format:", error);
    }
  }
  else return null;
  
};

export const refreshToken = async () => {
  try {
    let accessToken = getToken();
    const response = await api.get("/get-token", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    accessToken = response.data.accessToken;
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    return accessToken;
  } catch (error) {
    console.log("Error refreshing token:", error);
    return null;
  }
};


export const logging = async (payload) => {
  try {
    // Thử đăng nhập với API v3 trước
    try {
      const response = await api_v3.post("/login", payload);
      if (response.data) {
        // Nếu response có token
       
        // Nếu response có accessToken
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
          localStorage.setItem("token", JSON.stringify(response.data.accessToken));

          return {
            success: true,
            data: response.data,
            message: "Đăng nhập thành công",
          };
        }
        return response.data;
      }
    } catch (v3Error) {
      console.log("Failed to login with API v3, trying v1...");
    }
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
    // Thử đăng ký với API v2 trước
    try {
      const response = await api_v2.post("/register", payload);
      if (response && response.data) {
        return response.data;
      }
    } catch (v2Error) {
      console.log("Failed to register with API v2, trying v1...");
    }

    // Fallback tới API v1
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

export const logout = async () => {
  try {
    // Xóa token và accessToken từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profile");
    
    // Thử gọi API để logout
    try {
      await api.post("/logout");
    } catch (apiError) {
      console.log("API logout error:", apiError);
      // Tiếp tục xử lý logout dù có lỗi API
    }
    
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

export const changePassword = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không tìm thấy token" };
    }

    // Phiên bản v1 thì payload là đối tượng trực tiếp
    if (typeof payload === "object" && !payload.currentPassword) {
      const response = await api.post("/v1/auth/change-password", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } 
    // Phiên bản v2+ thì payload chứa các trường khác
    else {
      const { currentPassword, newPassword, confirmNewPassword, setError } = payload;
      
      if (newPassword !== confirmNewPassword) {
        if (setError) setError("Mật khẩu mới không khớp");
        return { success: false, message: "Mật khẩu mới không khớp" };
      }
      
      const response = await api.post(
        "change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error("Change password error:", error);
    if (payload.setError) {
      payload.setError("Change password has failed");
    }
    return {
      success: false,
      message: error.response?.data?.message || "Đổi mật khẩu thất bại",
    };
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/check-auth");
    if (response.data.isAuthenticated) {
      console.log("Đã đăng nhập, user:", response.data.user);
      return true;
    } else {
      console.log("Chưa đăng nhập:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error(
      "Lỗi kiểm tra:",
      error.response?.data?.message || error.message
    );
    return false;
  }
};

export default {
  getToken,
  logging,
  register,
  logout,
  changePassword,
  checkAuth,
  refreshToken
};