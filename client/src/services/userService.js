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
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.post(`${API_URL}upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
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
    const response = await axios.get(`${API_URL}/load-profile/${userId}`);
    return response.data.profile;
  } catch (error) {
    return { success: false, message: true };
  }
};

const uploadProfile = async (profile) => {
  try {
    let avatarId = profile.avatar; // Nếu avatar không thay đổi, giữ nguyên

    // **Bước 1: Upload avatar nếu file mới được chọn**
    if (profile.avatarFile) {
      const formData = new FormData();
      formData.append("avatar", profile.avatarFile);

      const avatarResponse = await axios.post('/api/upload/avatar', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      avatarId = avatarResponse.data.fileId; // ID của avatar mới từ GridFS
    }

    // **Bước 2: Gửi thông tin profile lên backend**
    const updatedProfile = {
      ...profile,
      avatar: avatarId,  // Đặt avatar mới (hoặc giữ nguyên nếu không thay đổi)
    };

    await axios.patch(`/api/profile/${profile.userId}`, updatedProfile);

    alert("✅ Profile đã được cập nhật thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    alert("❌ Có lỗi xảy ra khi cập nhật profile.");
  }
}

export { getUsers, getUser, addUser, getAvatar, uploadAvatar, loadProfile };
