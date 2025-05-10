const Chat = require("../models/chat.model");
const Emotion = require('../models/emotion.model');

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const {
      role,
      startDate,
      endDate,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Kiểm tra chatId
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp chatId hợp lệ",
      });
    }

    // Lấy thông tin user từ request (giả định đã có middleware auth)
    const user = req.payload;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa xác thực",
      });
    }

    // Tìm chat trong database
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat không tồn tại",
      });
    }
    // Kiểm tra quyền truy cập
    if (chat.userId.toString() != user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập chat này",
      });
    }

    // Sắp xếp tin nhắn theo createdAt
    let messages;
    if (role) {
      if (startDate && endDate) {
        messages = chat.messages.filter((message) => {
          return (
            new Date(message.createdAt) >= new Date(startDate).toISOString() &&
            new Date(message.createdAt) <= new Date(endDate).toISOString() &&
            message.role === role
          );
        });
      } else {
        messages = chat.messages.filter((message) => {
          return (message.role === role);
        });
      }
    }
    else{
      messages = chat.messages;
    }
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tin nhắn",
      error: error.message,
    });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp chatId",
      });
    }

    if (!message || !message.role || !message.text) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin message (role và text)",
      });
    }

    // Tìm chat trong database
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chat với ID đã cung cấp",
      });
    }    // Create message object with proper media handling
    const newMessage = {
      role: message.role,
      text: message.text,
      media: Array.isArray(message.media) ? message.media : []
    };
    
    // Thêm message mới vào mảng messages và lưu để lấy ID
    chat.messages.push(newMessage);
    const savedChat = await chat.save();
    const savedMessage = savedChat.messages[savedChat.messages.length - 1];
    
    // Add emotion tracking with proper ObjectId
    const emotionData = {
      userId: req.payload._id,
      emotion: message.emotion || 'neutral',
      emotionScore: message.emotionScore || 0.5,
      source: 'chat',
      sourceId: savedMessage._id,  // This is now properly created after save
      notes: savedMessage.text.substring(0, 100)
    };
    
    const emotionResponse = await Emotion.create(emotionData);

    // Trả về response thành công
    return res.status(200).json({
      success: true,
      message: newMessage,
      emotion: emotionResponse
    });
  } catch (error) {
    console.error("Error in addMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm tin nhắn",
      error: error.message,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    if (!chatId || !messageId)
      return res
        .status(404)
        .json({ success: false, message: "Thiếu thông tin" });
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );
    console.log(chat);
    if (!chat)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy message" });
    return res
      .status(200)
      .json({ success: true, message: "Xóa message thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { message } = req.body;

    if (!chatId || !messageId || !message) {
      return res
        .status(404)
        .json({ success: false, message: "Thiếu thông tin" });
    }
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, "messages._id": messageId },
      {
        $set: Object.keys(message).reduce((acc, key) => {
          acc[`messages.$.${key}`] = message[key];
          return acc;
        }, {}),
      },
      { new: true }
    );
    if (!chat)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy chat" });
    return res
      .status(200)
      .json({ success: true, message: "Cập nhật message thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
