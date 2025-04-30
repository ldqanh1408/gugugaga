const mongoose = require("mongoose");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Journal = require("../models/journal.model");
const Treatment = require("../models/treatment.model");
const Expert = require("../models/expert.model");
const bcrypt = require("bcrypt");
const redis = require("../utils/redisHelper");
const pubSub = require("../utils/pubSubHelper");
const constants = require("../constants");
const Booking = require("../models/booking.model");
const Schedule = require("../models/schedule.model");

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
    const keyCache = constants.USER_CACHE_KEY;
    const dataCache = await redis.get(`${keyCache}${userId}`);
    if (dataCache) {
      return res.status(200).json({ success: true, user: dataCache });
    }
    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Người dùng không tồn tại." });
    }
    await redis.set(`${keyCache}${userId}`, user);

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

    // Kiểm tra xem userId từ token có khớp với userId trong params không
    if (req.payload._id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thực hiện hành động này",
      });
    }

    const { title, content, receiveDate } = req.body;

    // Validate input
    if (!title?.trim() || !content?.trim() || !receiveDate) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin cần thiết",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    const newMail = {
      _id: new mongoose.Types.ObjectId(),
      title: title.trim(),
      content: content.trim(),
      sendDate: new Date(),
      receiveDate: new Date(receiveDate),
      notified: false,
      read: false,
    };

    user.futureMails = user.futureMails || [];
    user.futureMails.push(newMail);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Thêm thư thành công",
      futureMail: newMail,
    });
  } catch (error) {
    console.error("Error in addFutureMail:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm thư",
    });
  }
};

exports.getFutureMails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra xem userId từ token có khớp với userId trong params không
    if (req.payload._id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập thư này",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Lấy ngày hiện tại và reset về 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lọc thư có ngày nhận <= ngày hiện tại
    const availableMails = (user.futureMails || [])
      .filter((mail) => {
        const receiveDate = new Date(mail.receiveDate);
        receiveDate.setHours(0, 0, 0, 0);
        return receiveDate.getTime() <= today.getTime();
      })
      .sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate));

    console.log("Available mails:", availableMails); // Debug log

    res.status(200).json({
      success: true,
      futureMails: availableMails,
    });
  } catch (error) {
    console.error("Error in getFutureMails:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách thư",
    });
  }
};

exports.updateFutureMail = async (req, res) => {
  try {
    const { userId, mailId } = req.params;
    const { read, reply } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const mailIndex = user.futureMails.findIndex(
      (m) => m._id.toString() === mailId
    );
    if (mailIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Mail not found." });
    }

    if (read !== undefined) {
      user.futureMails[mailIndex].read = read;
    }
    if (reply !== undefined) {
      user.futureMails[mailIndex].reply = reply;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Mail updated successfully.",
      mail: user.futureMails[mailIndex],
    });
  } catch (error) {
    console.error("Error updating future mail:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTreatment = async (req, res) => {
  try {
    let { _id } = req.payload;
    const user = await User.findOne({ _id: _id });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Found not user" });
    const treatments = await Treatment.find({ user_id: _id })
      .populate("expert_id")
      .populate("schedule_id")
      .populate("user_id")
      .populate("business_id");
    return res.status(200).json({ success: true, treatments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTreatment = async (req, res) => {
  try {
    const { treatment_id } = req.params;
    const updateFields = req.body;

    // Bỏ undefined/null ra khỏi updateFields để tránh ghi đè rỗng
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined || updateFields[key] === null) {
        delete updateFields[key];
      }
    });

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      treatment_id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTreatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    return res.status(200).json({
      message: "Treatment updated successfully",
      data: updatedTreatment,
    });
  } catch (error) {
    console.error("Error updating treatment:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const { _id } = req.payload; // Lấy user_id từ payload (token)
    // Truy vấn booking của người dùng
    const booking = await Booking.findOne({ user_id: _id });

    // Kiểm tra nếu không tìm thấy booking
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Trả về booking tìm được
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    // Nếu có lỗi, trả về lỗi với thông tin chi tiết
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReceivers = async (req, res) => {
  try {
    const { _id } = req.payload;

    // Lấy booking của user
    const booking = await Booking.findOne({ user_id: _id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const availableExperts = [];

    // Duyệt qua từng expert
    for (const expertId of booking.expert_ids) {
      // Lấy schedule của expert đó
      const schedules = await Schedule.find({ expert_id: expertId });
      // Kiểm tra xem có lịch nào trùng không
      const isConflict = schedules?.some((schedule) => {
        return (
          booking.start_time < schedule.end_time &&
          schedule.start_time < booking.end_time
        );
      });

      if (!isConflict) {
        const expert = await Expert.findOne({ _id: expertId }).populate(
          "business_id"
        );
        availableExperts.push(expert); // Không bị trùng thì cho vào danh sách
      }
    }
    return res.status(200).json({ success: true, data: availableExperts });
  } catch (error) {
    console.error("getReceivers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
