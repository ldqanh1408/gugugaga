const Expert = require("../models/expert.model");
const Business = require("../models/business.model");
const Treatment = require("../models/treatment.model");
const Schedule = require("../models/schedule.model");
const bcrypt = require("bcrypt");
const redisHelper = require("../utils/redisHelper");
const constants = require("../constants");
const pubSubHelper = require("../utils/pubSubHelper");
const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

exports.addExpert = async (req, res) => {
  try {
    let {
      account = "",
      password = "",
      expert_name = "",
      gender = "",
      diploma_url = "",
      avatar_url = "",
    } = req.body;
    // Kiểm tra các trường bắt buộc
    if (!account || !password || !expert_name || !gender) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu thông tin bắt buộc: account, password, expert_name, gender, diploma_url",
      });
    }

    password = await hashPassword(password);

    const business = req.payload;
    let business_id = business._id;
    business_id = new mongoose.Types.ObjectId(business_id);

    const role = "EXPERT";
    const number_of_treatment = 0;

    const newExpert = new Expert({
      account,
      password,
      expert_name,
      gender,
      role,
      number_of_treatment,
      diploma_url,
      business_id,
      avatar_url,
    });

    await newExpert.save();

    await pubSubHelper.publishInvalidation(constants.CHANEL_EXPERTS, {
      businessId: business._id,
    });

    return res.status(200).json({ success: true, expert: newExpert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExperts = async (req, res) => {
  try {
    const temp_business = req.payload;

    let business_id = new mongoose.Types.ObjectId(temp_business._id);
    const business = await Business.findOne({ _id: business_id });
    if (!business)
      return res
        .status(404)
        .json({ success: false, message: "Found not business" });
    const experts = await Expert.find({ business_id: business_id });

    return res.status(200).json({ success: true, experts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTreatment = async (req, res) => {
  try {
    let { _id } = req.payload;
    const expert = await Expert.findOne({ _id: _id });
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: "Found not expert" });

    const treatments = await Treatment.find({ expert_id: _id })
      .populate("user_id")
      .populate("expert_id")
      .populate("business_id")
    treatments.map((t) => console.log(t.business_id))
      return res.status(200).json({ success: true, data: treatments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableExperts = async (req, res) => {
  try {
    const { start_time, end_time } = req.body;

    // Lấy các schedule mà start hoặc end bị trùng với yêu cầu
    const schedules = await Schedule.find({
      status: true,
      $or: [
        {
          start_time: { $lt: end_time, $gte: start_time }
        },
        {
          end_time: { $gt: start_time, $lte: end_time }
        }
      ]
    });

    const expert_ids = schedules.map((s) => s.expert_id);

    const experts = await Expert.find({
      _id: { $nin: expert_ids }, // Lọc ra những expert không có lịch trùng
    });

    return res.status(200).json({ success: true, experts });
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

exports.receiveBooking = async (req, res) => {
  try {
    const { _id } = req.payload;
    const { booking_id } = req.params;

    // Tìm booking với booking_id
    const booking = await Booking.findOne({ _id: booking_id });
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Kiểm tra nếu expert đã có trong mảng expert_ids rồi không
    if (booking.expert_ids.includes(_id)) {
      return res.status(400).json({ message: "You have already received this booking" });
    }

    // Thêm expert_id vào mảng expert_ids
    booking.expert_ids.push(_id);

    // Lưu lại booking sau khi cập nhật
    await booking.save();

    return res.status(200).json({ message: "Booking received successfully", booking });
  } catch (error) {
    console.error("receiveBooking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getBookings = async (req, res) => {
  try {
    const { _id } = req.payload; // Lấy _id từ payload (người dùng đang đăng nhập)
    
    // Lấy tất cả các schedule của expert với _id
    const schedules = await Schedule.find({ expert_id: _id });

    // Tạo mảng để chứa các schedule không bị trùng
    const availableBookings = [];

    // Lấy tất cả các booking mà expert có thể nhận
    const bookings = await Booking.find();

    // Kiểm tra từng booking để xem lịch của booking có trùng với schedule nào không
    for (const booking of bookings) {
      let isConflict = false;

      // Kiểm tra xem lịch của booking có bị trùng với schedule của expert không
      for (const schedule of schedules) {
        if (
          (booking.start_time < schedule.end_time) &&
          (schedule.start_time < booking.end_time)
        ) {
          // Nếu bị trùng, đánh dấu và không thêm vào mảng availableBookings
          isConflict = true;
          break;
        }
      }

      // Nếu không bị trùng lịch, thêm vào mảng availableBookings
      if (!isConflict) {
        availableBookings.push(booking);
      }
    }

    return res.status(200).json({ bookings: availableBookings });
  } catch (error) {
    console.error("getBookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
