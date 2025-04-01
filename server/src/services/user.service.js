const User = require("../models/user.model");

// Tạo một người dùng mới
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Lấy thông tin của một người dùng
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Cập nhật thông tin của một người dùng
const updateUser = async (userId, updatedData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
};
