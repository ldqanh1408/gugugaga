const User = require("../models/user.model");
const { ObjectId } = require("mongodb");

const addFutureMail = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, content, sendDate, receiveDate } = req.body;

    if (!title || !content || !sendDate || !receiveDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ success: true, message: "✅ Xóa người dùng thành công." });
  } catch (error) {
    console.error("❌ Lỗi khi xóa người dùng:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xóa người dùng." });
  }
};

exports.getUser = async (req, res) => {
  try {

    const { _id } = req.payload;
    const userId = _id;
  
    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Người dùng không tồn tại." });
    }

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy người dùng." });
  }
};

exports.loadProfile = async (req, res) => {
  try {
    const { _id } = req.payload;
    // Kiểm tra xem user có tồn tại không

    const user = await User.findOne({ _id: _id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Người dùng không tồn tại." });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, messsage: error.message });
  }
};

exports.uploadProfile = async (req, res) => {
  try {
    const { _id } = req.payload;
    const userId = _id;
    // Kiểm tra xem user có tồn tại không
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Người dùng không tồn tại." });
    }

    const { nickName, userName, bio, dob, gender, phone, email, avatar } =
      req.body;
    console.error(req.body);

    // Kiểm tra và upload ảnh lên Cloudinary nếu có file được tải lên

    // Cập nhật thông tin khác của user (và avatar mới nếu có)
    user.avatar = avatar || user.avatar;
    user.userName = nickName || user.userName;
    user.bio = bio || user.bio;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "✅ Hồ sơ đã được cập nhật thành công.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addFutureMail = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, content, sendDate, receiveDate, notified, read } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newMail = {
      title,
      content,
      sendDate: new Date(sendDate),
      receiveDate: new Date(receiveDate),
      notified: false,
      read: false,
    };

    user.futureMails.push(newMail);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Future mail added successfully",
      futureMail: newMail,
    });
  } catch (error) {
    console.error("Error adding future mail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFutureMails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const futureMails = user.futureMails.sort(
      (a, b) => new Date(b.sendDate) - new Date(a.sendDate)
    );

    return res.status(200).json({
      success: true,
      futureMails,
    });
  } catch (error) {
    console.error("Error fetching future mails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateFutureMail = async (req, res) => {
  try {
    const { userId, mailId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const mail = user.futureMails.id(mailId);
    if (!mail) {
      return res.status(404).json({
        success: false,
        message: "Mail not found",
      });
    }

    Object.assign(mail, updates);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Future mail updated successfully",
      mail,
    });
  } catch (error) {
    console.error("Error updating future mail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTodayMails = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const todayMails = user.futureMails.filter((mail) => {
      const receiveDate = new Date(mail.receiveDate);
      return receiveDate >= today && receiveDate < tomorrow;
    });

    return res.status(200).json({
      success: true,
      todayMails,
    });
  } catch (error) {
    console.error("Error fetching today's mails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const markMailNotified = async (req, res) => {
  try {
    const { userId, mailId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const mail = user.futureMails.id(mailId);
    if (!mail) {
      return res.status(404).json({
        success: false,
        message: "Mail not found",
      });
    }

    mail.notified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Mail marked as notified",
      mail,
    });
  } catch (error) {
    console.error("Error marking mail as notified:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addFutureMail,
  getFutureMails,
  updateFutureMail,
  getTodayMails,
  markMailNotified,
};
