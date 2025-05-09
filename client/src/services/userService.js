import axios from "axios";
import { getToken, getPayLoad } from "../services";
const API_URL = "http://localhost:5000/api/v1/";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

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
    const response = await axios.get(`${API_URL}users/me`);
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
    const response = await api.get(`${API_URL}users/load-profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return { message: true };
  }
};

const uploadProfile = async ({ profile, avatarFile }) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    let avatarUrl = profile.avatar; // Nếu không thay đổi ảnh thì giữ nguyên

    // **Bước 1: Upload avatar lên Cloudinary (nếu có file mới được chọn)**
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile); // Thêm file avatar vào form data
      const uploadResponse = await axios.post(
        `${API_URL}users/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );

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
      `${API_URL}users/upload-profile`,
      updatedProfile,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
        withCredentials: true, // Đảm bảo cookie được gửi kèm
      }
    );
    
    return data.data;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật profile:", error);
    alert("❌ Có lỗi xảy ra khi cập nhật profile.");
    return { success: false, message: "Lỗi khi cập nhật profile." };
  }
};


export const getTreaments = async () => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = "/v1/users/me/treatments";
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateTreatment = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/v1/users/me/treatments/${payload.treatment_id}`;
    const response = await api.patch(url, payload.data, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getReceivers = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/v1/users/me/receivers`;
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createBooking = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/v1/bookings`;
    const response = await api.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const addFutureMail = async (userId, mailData) => {
  try {
    const token = await getToken();
    const response = await axios.post(
      `${API_URL}users/${userId}/future-mails`,
      mailData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding future mail:", error);
    throw error;
  }
};

const getFutureMails = async (userId) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${API_URL}users/${userId}/future-mails`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.futureMails;
  } catch (error) {
    console.error("Error fetching future mails:", error);
    throw error;
  }
}

export const cancelBooking = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `v1/bookings/${payload.booking_id}`;
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getMyBooking = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/v1/users/me/bookings`;
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const acceptBooking = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    console.log("Payload:", payload)
    const url = `/v1/bookings/${payload.booking_id}/accept`;
    const response = await api.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });

    return response.data;
  } catch (error) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
};

const uploadAudio = async (audioFile) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Token not found" };
    }

    const formData = new FormData();
    formData.append("file", audioFile);

    const response = await axios.post(`${API_URL}media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (response.data && response.data.success) {
      return { success: true, audioUrl: response.data.url || response.data.audioUrl }; 
    } else {
      return { success: false, message: "Audio upload failed" };
    }
  } catch (error) {
    console.error("Error uploading audio:", error);
    return { success: false, message: error.response?.data?.message || "Error uploading audio" };
  }
};

const uploadImage = async (imageFile) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Token not found" };
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post(`${API_URL}media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (response.data && response.data.success) {
      return { success: true, imageUrl: response.data.url || response.data.imageUrl };
    } else {
      return { success: false, message: "Image upload failed" };
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: error.response?.data?.message || "Error uploading image" };
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
  uploadImage,
  addFutureMail,
  getFutureMails,
  uploadAudio,
};
