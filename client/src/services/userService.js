import axios from "axios";
import { getToken } from "./authService";
const API_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
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



const addUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
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

    const response = await axios.post(`${API_URL}/users/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getAvatar = async (fileId) => {
  try {
    return `${API_URL}/avatar/${fileId}`;
  } catch (error) {
    return { success: false, message: error.message };
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

const loadProfile = async () => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Token không tồn tại");
      return null;
    }
    const response = await api.get(`/users/load-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error loading profile:", error);
    return { success: false, message: error.message };
  }
};

const uploadProfile = async ({ profile, avatarFile }) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    let avatarUrl = profile.avatar;

    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const uploadResponse = await axios.post(
        `${API_URL}/users/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (uploadResponse.data && uploadResponse.data.success) {
        avatarUrl = uploadResponse.data.imageUrl;
      } else {
        return { success: false, message: "❌ Upload avatar thất bại." };
      }
    }

    const updatedProfile = {
      ...profile,
      avatar: avatarUrl,
    };
    const data = await axios.patch(
      `${API_URL}/users/upload-profile`,
      updatedProfile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return data.data;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật profile:", error);
    return { success: false, message: "Lỗi khi cập nhật profile." };
  }
};

const getTreaments = async () => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = "/users/me/treatments";
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateTreatment = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/users/me/treatments/${payload.treatment_id}`;
    const response = await api.patch(url, payload.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getReceivers = async () => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/users/me/receivers`;
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const createBooking = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/bookings`;
    const response = await api.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.post(
      `/users/${userId}/future-mails`,
      mailData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to add mail");
    }

    return response.data;
  } catch (error) {
    console.error("Error adding future mail:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw error;
  }
};

const getFutureMails = async (userId) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("No token found");
      return [];
    }

    const response = await api.get(`/users/${userId}/future-mails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch mails");
    }

    const mails = response.data.futureMails || [];
    return mails.sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate));
  } catch (error) {
    console.error("Error fetching future mails:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return [];
  }
};

const updateFutureMail = async (userId, mailId, updates) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.patch(
      `${API_URL}/users/${userId}/future-mails/${mailId}`,
      updates,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.mail;
  } catch (error) {
    console.error("Error updating future mail:", error);
    throw error;
  }
};

const getTodayMails = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return [];
    }

    const response = await api.get(`/users/${userId}/today-mails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch today's mails");
    }

    return response.data.todayMails || [];
  } catch (error) {
    console.error("Error fetching today's mails:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return [];
  }
};

const markMailNotified = async (userId, mailId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      throw new Error("No token found");
    }

    const response = await api.patch(
      `/users/${userId}/future-mails/${mailId}/notify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to mark mail as notified"
      );
    }

    return response.data.mail;
  } catch (error) {
    console.error("Error marking mail as notified:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw error;
  }
};

const cancelBooking = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/bookings/${payload.booking_id}`;
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getMyBooking = async () => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/users/me/bookings`;
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const acceptBooking = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Không có token" };
    }
    const url = `/bookings/${payload.booking_id}/accept`;
    const response = await api.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
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

    const response = await axios.post(`${API_URL}/media`, formData, {
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
    // Validate file type
    if (!imageFile || !imageFile.type.startsWith('image/')) {
      return { success: false, message: "Invalid file type. Please select an image file." };
    }

    const token = await getToken();
    if (!token) {
      return { success: false, message: "Not authenticated. Please log in again." };
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post(`${API_URL}/media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
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
  addUser,
  getAvatar,
  uploadAvatar,
  loadProfile,
  uploadProfile,
  uploadImage,
  uploadAudio,
  addFutureMail,
  getFutureMails,
  updateFutureMail,
  getUser,
  getTodayMails,
  markMailNotified,
  getTreaments,
  updateTreatment,
  getReceivers,
  createBooking,
  cancelBooking,
  getMyBooking,
  acceptBooking,
};