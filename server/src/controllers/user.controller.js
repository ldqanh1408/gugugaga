const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Journal = require("../models/journal.model");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Lấy danh sách users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(404).json({ message: "Danh sách rỗng" });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Người dùng không tồn tại." });
    }

    // Xóa user
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
    const { userId } = req.params;

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
    const { userId } = req.params;
    // Kiểm tra xem user có tồn tại không
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Người dùng không tồn tại." });
    }
    return res.status(200).json({
      success: true,
      profile: {
        avatar: user.avatar,
        nickName: user.nickName,
        userName: user.userName,
        bio: user.bio,
        dob: user.dob,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, messsage: error.message });
  }
};
exports.uploadProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    // Kiểm tra xem user có tồn tại không
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Người dùng không tồn tại." });
    }

    // Cập nhật thông tin profile (bao gồm avatar từ GridFS)
    const { nickName, userName, bio, dob, gender, phone, email, avatar } =
      req.body;

    // Kiểm tra file avatar tải lên (nếu có) và cập nhật vào GridFS
    const newAvatarId = avatar; // ID của file trong GridFS sau khi upload

    // Nếu user đã có avatar trước đó, xóa avatar cũ khỏi GridFS
    if (user.avatar && user.avatar !== "defaultAvatarId") {
      const oldAvatarId = new mongoose.Types.ObjectId(user.avatar);
      gfs.delete(oldAvatarId, (err) => {
        if (err) console.error("Lỗi khi xóa avatar cũ:", err);
      });
    }

    // Cập nhật ID avatar mới vào user profile
    user.avatar = newAvatarId;

    // Cập nhật các thông tin khác của user (ngoài avatar)
    user.nickName = nickName || user.nickName;
    user.userName = userName || user.userName;
    user.bio = bio || user.bio;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    await user.save();

    return res.status(200).json({ 
      success: true,
      message: "✅ Hồ sơ đã được cập nhật thành công.",
      profile: {
        avatar: user.avatar,
        nickName: user.nickName,
        userName: user.userName,
        bio: user.bio,
        dob: user.dob,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
