const Chat = require("../models/chat.model");


exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Kiểm tra chatId
    if (!chatId) {
      return res.status(400).json({ 
        success: false, 
        message: "Vui lòng cung cấp chatId hợp lệ" 
      });
    }

    // Lấy thông tin user từ request (giả định đã có middleware auth)
    const user = req.user;
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Người dùng chưa xác thực" 
      });
    }

    // Tìm chat trong database
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: "Chat không tồn tại" 
      });
    }
    
    console.log(chat.userId);
    console.log(user._id);
    // Kiểm tra quyền truy cập
    if (chat.userId.toString() != user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền truy cập chat này" 
      });
    } 

    // Sắp xếp tin nhắn theo createdAt
    const messages = chat.messages.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    return res.status(200).json({ 
      success: true, 
      messages 
    });

  } catch (error) {
    console.error('Error in getMessages:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi server khi lấy tin nhắn", 
      error: error.message 
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
        message: "Vui lòng cung cấp chatId" 
      });
    }

    if (!message || !message.role || !message.text) {
      return res.status(400).json({ 
        success: false, 
        message: "Vui lòng cung cấp đầy đủ thông tin message (role và text)" 
      });
    }

    // Tìm chat trong database
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy chat với ID đã cung cấp" 
      });
    }

    // Thêm message mới vào mảng messages
    chat.messages = [...chat.messages, message];
    await chat.save();

    // Trả về response thành công
    return res.status(200).json({ 
      success: true, 
      message: "Thêm tin nhắn thành công", 
    });

  } catch (error) {
    console.error('Error in addMessage:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi server khi thêm tin nhắn", 
      error: error.message 
    });
  }
};
