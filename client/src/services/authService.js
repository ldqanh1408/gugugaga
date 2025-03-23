import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
export const register = async ({
  userName,
  account,
  password,
  email,
  phoneNumber,
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      userName,
      password,
      account,
      phoneNumber,
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const logging = async ({ account, password }) => {
  try {
    const response = await axios.post(`${API_URL}/login`,{ account, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Nếu backend dùng cookie
      });
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth');
    if (response.data.isAuthenticated) {
      console.log('Đã đăng nhập, user:', response.data.user);
      return true;
    } else {
      console.log('Chưa đăng nhập:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('Lỗi kiểm tra:', error.response?.data?.message || error.message);
    return false;
  }
};

export const getToken = async () => {
  try {
    const response = await api.get('/get-token');
    const { token } = response.data;
    console.log('Token:', token);
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
  }
  catch(error){
    console.error({message: error.message});
  }
}

export async function getPayLoad() {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/me', {
      withCredentials: true, // Gửi cookie để server giải mã
    });
    return response.data; // { userId, journalId }
  } catch (error) {
    console.error('Lỗi lấy payload:', error);
    return {};
  }
}