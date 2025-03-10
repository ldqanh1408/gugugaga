const Chat = require("../models/chat.model");

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId });
    const user = req.user;

    if (!chat)
      return res
        .status(400)
        .json({ success: false, message: "Chat not found" });

    if (!user) return res.status(404).json({ success: false });
    if (chat.userId.toString() !== user._id.toString()) {
      return res.status(409).json({ success: false, message: "Conflict" });
    }
    const messages = chat.messages;
    messages.sort((a, b) => Date(a.createdAt) - Date(b.createdAt));
    res.json({ success: true, messages: messages });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi lấy dữ liệu", error: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const {chatId} = req.params;
    const { message } = req.body;
    const chat = await Chat.findOne({_id: chatId});
    if(!message.role || !message.text) return res.status(400).json({success: false, message: "Not enough information"});
    if (!chat)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
        console.log(chat);
    chat.messages = [...chat.messages, message]
    await chat.save();
    return res.status(200).json({ success: true, messages: "add thành công" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
