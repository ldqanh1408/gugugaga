import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const api_2 = axios.create({
  baseURL: "http://localhost:5000/api/v2",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const api_3 = axios.create({
  baseURL: "http://localhost:5000/api/v3",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
export const register = async (payload) => {
  try {
    const response = await api_2.post("/register", payload);
    return response?.data;
  } catch (error) {
    console.error("Error fetching:", error?.response?.data?.errors);
    throw error;
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
    setError("Change password has failed");
    console.error({ message: error.message });
    return { success: false, message: error.message };
  }
}
