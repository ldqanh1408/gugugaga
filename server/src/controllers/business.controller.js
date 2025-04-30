const mongoose = require("mongoose");
const Business = require("../models/business.model");
const Expert = require("../models/expert.model");
const bcrypt = require("bcryptjs"); // dùng để hash password
const Treatment = require("../models/treatment.model");
exports.deleteExpert = async (req, res) => {
  try {
    const { expert_id } = req.params;

    // Kiểm tra expert tồn tại
    const expert = await Expert.findById(expert_id);

    if (!expert) {
      return res
        .status(404)
        .json({ success: false, message: "Expert not found" });
    }

    // Xoá expert
    await Expert.deleteOne({ _id: expert_id });

    return res.status(200).json({ success: true, data: expert });
  } catch (error) {
    console.error("Error deleting expert:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.updatedExpert = async (req, res) => {
  try {
    const { expert_id } = req.params; // ID lấy từ URL
    const updateData = req.body; // Các field cần cập nhật

    const updatedExpert = await Expert.findOneAndUpdate(
      { _id: expert_id },
      updateData,
      { new: true, runValidators: true } // new: trả về bản mới, runValidators: chạy validate Mongoose
    ).populate("business_id"); // populate business_id với trường name

    if (!updatedExpert) {
      return res
        .status(404)
        .json({ success: false, message: "Expert not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Expert updated successfully",
      data: updatedExpert,
    });
  } catch (error) {
    console.error("Error updating expert:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { _id } = req.payload;
    const treatments = await Treatment.find({ business_id: _id })
      .populate("user_id")
      .populate("business_id")
      .populate("expert_id");

    const complaints = treatments?.filter(
      (treatment) =>
        treatment.complaint !== null && treatment.complaint !== undefined
    );
    if (!complaints) {
      return res
        .status(404)
        .json({ success: false, message: "No complaints found" });
    }
    return res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    console.error("Error getting complaints:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
