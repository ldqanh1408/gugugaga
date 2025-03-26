import axios from "axios";
import {getToken, getPayLoad} from "../services"
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
    if(!token){
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

export { getUsers, getUser, addUser };
