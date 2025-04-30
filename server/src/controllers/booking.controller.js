const Expert = require("../models/expert.model");
const Business = require("../models/business.model");
const Treatment = require("../models/treatment.model");
const Schedule = require("../models/schedule.model");
const Booking = require("../models/booking.model");

exports.requestBooking = async (req, res) => {
  try {
    const { _id } = req.payload;
    const { start_time, end_time, description, duration } = req.body;

    // Chuyển đổi start_time và end_time từ ISOString sang Date
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    // Lấy ngày bắt đầu và kết thúc trong ngày (ngày không có giờ, phút, giây)
    const dayStart = new Date(startDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(startDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Kiểm tra xem có booking nào của user trong cùng ngày đã tồn tại chưa (bao gồm cả giờ, phút, giây)
    const existingBooking = await Booking.findOne({
      user_id: _id,
      start_time: { $gte: dayStart, $lte: dayEnd },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "You already have a booking on this day." });
    }

    // Kiểm tra xem có booking nào chồng lên thời gian của booking này
    const overlappingBooking = await Booking.findOne({
      user_id: _id,
      $or: [
        { start_time: { $lt: endDate }, end_time: { $gte: startDate } }, // Booking này có thể bắt đầu trước và kết thúc sau
        { start_time: { $gte: startDate }, start_time: { $lt: endDate } }, // Booking này có thể bắt đầu trong khoảng giữa thời gian của booking khác
      ],
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: "Your booking time overlaps with another booking." });
    }

    // Tạo booking mới
    const booking = new Booking({
      start_time,
      end_time,
      description,
      user_id: _id,
    });

    // Lưu vào database
    await booking.save();

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { _id } = req.payload; // Lấy user ID từ payload (ví dụ sau khi xác thực JWT)
    const { booking_id } = req.params; // Lấy booking ID từ param URL

    // Kiểm tra xem booking có tồn tại và thuộc về user không
    const booking = await Booking.findOne({ _id: booking_id, user_id: _id });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or not authorized" });
    }

    // Xóa booking
    await Booking.deleteOne({ _id: booking_id });

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    const { _id } = req.payload;
    const { booking_id } = req.params;
    const { expert_id, description = "", duration } = req.body;

    // Kiểm tra booking có tồn tại và thuộc về user
    const booking = await Booking.findOne({ _id: booking_id, user_id: _id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Kiểm tra expert có tồn tại
    const expert = await Expert.findById(expert_id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Tạo schedule mới
    const schedule = new Schedule({
      start_time: booking.start_time,
      end_time: booking.end_time,
      user_id: _id,
      expert_id,
      status: true,
    });

    // Tạo treatment mới
    const treatment = new Treatment({
      treatmentStatus: "pending",
      schedule_id: schedule._id,
      user_id: _id,
      expert_id,
      business_id: expert.business_id,
      description,
      duration,
    });

    // Lưu cả 2 và xoá booking
    await schedule.save();
    await treatment.save();
    await Booking.deleteOne({ _id: booking_id });

    return res.status(200).json({
      message: "Booking accepted successfully",
      data: { schedule, treatment },
    });
  } catch (error) {
    console.error("acceptBooking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
