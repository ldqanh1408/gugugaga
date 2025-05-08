import api from "./api";
import { jwtDecode } from "jwt-decode";

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
    const response = await api_3.post("/login", payload);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error(
      error.response?.data?.message || "Incorrect password or account."
    );
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

export const getToken = async () => {
  try {
    let accessToken = JSON.parse(localStorage.getItem("accessToken")); // Hoặc chỗ bạn lưu token
    const response = await api.get("/get-token", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    accessToken = response.data.accessToken;
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem("accessToken");
    await api.post("/logout");
    // Không xóa profile từ localStorage khi đăng xuất
    localStorage.removeItem("token");
  } catch (error) {
    console.error({ message: error.message });
  }
};

export async function getPayLoad() {
  try {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const response = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // { userId, journalId }
  } catch (error) {
    console.error("Lỗi lấy payload:", error);
    return {};
  }
}

export async function changePassword({
  currentPassword,
  confirmNewPassword,
  newPassword,
  setError,
}) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token");
    }
    if (newPassword !== confirmNewPassword) {
      setError("Change password has failed");
    }
    const response = await api.post(
      `change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
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
