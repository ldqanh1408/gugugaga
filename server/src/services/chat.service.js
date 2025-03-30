const Chat = require("../models/chat.model");

// Tạo một cuộc trò chuyện mới
const createChat = async (participants) => {
  try {
    const chat = new Chat({ participants });
    await chat.save();
    return chat;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Lấy danh sách các cuộc trò chuyện của người dùng
const getChatsByUserId = async (userId) => {
  try {
    const chats = await Chat.find({ participants: userId });
    return chats;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Gửi tin nhắn trong một cuộc trò chuyện
// Ví dụ trong chat.service.js
const sendMessage = async (chatId, senderId, message) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found"); // Thêm dòng này
    chat.messages.push({ sender: senderId, content: message });
    await chat.save();
    return chat;
  } catch (error) {
    console.error("[sendMessage Error]:", error); // Thêm context
    throw error;
  }
};

module.exports = {
  createChat,
  getChatsByUserId,
  sendMessage,
};
