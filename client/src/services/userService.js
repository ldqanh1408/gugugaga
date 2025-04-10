import axios from "axios";
import { getToken, getPayLoad } from "../services";
const API_URL = "http://localhost:5000/api/v1/";

const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getUser = async () => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Token không tồn tại");
      return null;
    }
    const { userId } = await getPayLoad();
    const response = await axios.get(`${API_URL}users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error(`Error fetching user with id :`, error);
    throw error;
  }
};

const addUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const uploadAvatar = async (file) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không tìm thấy token" };
    }
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.post(`${API_URL}users/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
      withCredentials: true,
    });

    return response.data; // Trả về fileId (GridFS)
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getAvatar = async (fileId) => {
  try {
    return `${API_URL}avatar/${fileId}`; // URL để fetch ảnh từ backend
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const loadProfile = async () => {
  try {
    const token = await getToken();

    if (!token) {
      console.error("Token không tồn tại");
      return null;
    }
    const { userId } = await getPayLoad();
    const response = await axios.get(`${API_URL}users/load-profile/${userId}`);
    return response.data.profile;
  } catch (error) {
    return { success: false, message: true };
  }
};

const uploadProfile = async ({ profile, avatarFile }) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const payload = await getPayLoad();
    let avatarUrl = profile.avatar; // Nếu không thay đổi ảnh thì giữ nguyên

    // **Bước 1: Upload avatar lên Cloudinary (nếu có file mới được chọn)**
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile); // Thêm file avatar vào form data

      const uploadResponse = await axios.post(`${API_URL}users/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      // Lấy URL ảnh từ response nếu upload thành công
      if (uploadResponse.data && uploadResponse.data.success) {
        avatarUrl = uploadResponse.data.imageUrl;
      } else {
        return { success: false, message: "❌ Upload avatar thất bại." };
      }
    }
    // **Bước 2: Cập nhật profile (bao gồm avatar mới nếu có)**
    const updatedProfile = {
      ...profile,
      avatar: avatarUrl, // Cập nhật avatar mới hoặc giữ nguyên nếu không đổi
    };
    // Gửi thông tin profile đã cập nhật lên backend
    const data = await axios.patch(
      `${API_URL}users/upload-profile/${payload.userId}`,
      updatedProfile,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
        withCredentials: true, // Đảm bảo cookie được gửi kèm
      }
    );
    return { success: true, profile: data.data.profile };
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật profile:", error);
    alert("❌ Có lỗi xảy ra khi cập nhật profile.");
    return { success: false, message: "Lỗi khi cập nhật profile." };
  }
};


export {
  getUsers,
  getUser,
  addUser,
  getAvatar,
  uploadAvatar,
  loadProfile,
  uploadProfile,
};
