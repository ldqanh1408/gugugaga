const Chat = require("../models/user.model");

// Lấy danh sách users
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo user mới
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const newChat = new Chat({ userId });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo user" });
  }
};