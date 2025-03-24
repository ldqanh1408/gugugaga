import axios from "axios";
import { getPayLoad, getToken } from "./authService";
const API_URL = "http://localhost:5000/api/v1/journals/";

export const getNotes = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("Không tìm thấy token");
  }
  try {
    const { journalId } = await getPayLoad();
    if (!journalId) {
      throw new Error("Journal ID không tồn tại");
    }
    console.warn("Journal ID:", journalId);
    const url = `${API_URL}${journalId}/notes`;
    console.log("Gửi request tới:", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    console.log("Response từ getNotes:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching notes:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const saveNote = async (newNote) => {
  const token = await getToken();
  if (!token) {
    throw new Error("Không tìm thấy token");
  }
  try {
    const { journalId } = await getPayLoad();
    if (!journalId) {
      throw new Error("Journal ID không tồn tại");
    }
    const url = `${API_URL}${journalId}/notes`;
    const response = await axios.post(url, newNote, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data.note;
  } catch (error) {
    console.error(
      "Error fetching notes:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateNote = async ({ note: updatedNote }) => {
  const token = await getToken();
  if (!token) {
    throw new Error("Không tìm thấy token");
  }
  try {
    const { journalId } = await getPayLoad();
    if (!journalId) {
      throw new Error("Journal ID không tồn tại");
    }
    console.error("test:", updatedNote._id);
    const url = `${API_URL}${journalId}/notes/${updatedNote._id}`;
    const response = await axios.patch(
      url,
      { note: updatedNote },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
    return response.data.note;
  } catch (error) {
    console.error(
      "Error fetching notes:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
