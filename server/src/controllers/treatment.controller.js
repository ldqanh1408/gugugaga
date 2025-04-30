const Expert = require("../models/expert.model");
const Business = require("../models/business.model");
const Schedule = require("../models/schedule.model");
const Treatment = require("../models/treatment.model");
const { findOne } = require("../models/user.model");
const mongoose = require("mongoose");

exports.requestTreatment = async (req, res) => {
  try {
    const user = req.payload;
    const user_id = user._id;
    const { expert_id, description, duration } = req.body;
    const expert = await Expert.findOne({ _id: expert_id });
    let { start_time, end_time } = req.body;
    if (!user || !start_time || !end_time) {
      return res
        .status(404)
        .json({ success: false, message: "Not enough infomation" });
    }
    const schedule = new Schedule({
      start_time,
      end_time,
      user_id,
      expert_id,
      status: false,
    });
    const treatment = new Treatment({
      treatmentStatus: "pending",
      schedule_id: schedule._id,
      user_id,
      expert_id,
      business_id: expert.business_id,
      description: description || "",
      duration,
    });
    await schedule.save();
    await treatment.save();
    return res.status(200).json({ success: true, treatment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptTreatment = async (req, res) => {
  try {
    const { _id } = req.payload;
    const { treatment_id } = req.params;

    const expert = await Expert.findOne({ _id: _id });
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: "Expert not found" });

    const treatment = await Treatment.findOne({ _id: treatment_id }).populate(
      "schedule_id"
    );
    if (!treatment)
      return res
        .status(404)
        .json({ success: false, message: "Treatment not found" });

    treatment.treatmentStatus = "approved";
    await treatment.save();

    // Set schedule status to true
    if (treatment.schedule_id) {
      treatment.schedule_id.status = true;
      await treatment.schedule_id.save();
    }

    res.status(200).json({ success: true, treatment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectTreatment = async (req, res) => {
  try {
    const { _id } = req.payload; // expert id từ token
    const { treatment_id } = req.params;
    const { reason_reject } = req.body;

    // Kiểm tra lý do từ chối
    if (!reason_reject || reason_reject.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Reason for rejection is required." });
    }

    // Kiểm tra expert tồn tại
    const expert = await Expert.findById(_id);
    if (!expert) {
      return res
        .status(404)
        .json({ success: false, message: "Expert not found." });
    }

    // Tìm treatment
    const treatment = await Treatment.findById(treatment_id);
    if (!treatment) {
      return res
        .status(404)
        .json({ success: false, message: "Treatment not found." });
    }

    // Cập nhật
    treatment.treatmentStatus = "rejected";
    treatment.reason_reject = reason_reject;
    await treatment.save();

    return res.status(200).json({ success: true, treatment });
  } catch (error) {
    console.error("Reject Treatment Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeTreatment = async (req, res) => {
  try {
    const { _id } = req.expert;
    const { treatment_id } = req.params;
    const expert = await Expert.findOne({ _id: _id });
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: "Found not expert" });
    const treatment = await Treatment.findOne({ _id: treatment_id });
    treatment.treatmentStatus = "completed";
    await treatment.save();

    res.status(200).json({ success: true, treatment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { _id } = req.payload;
    const treatments = Treatment.find({
      business_id: _id,
      $or: [{ complaint: { $ne: "" } }, { complaint: { $ne: null } }],
    });
    if (!treatments || treatments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No treatments found with complaints",
      });
    }

    return res.status(200).json({ success: true, data: treatments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { expert_id } = req.params; // expert_id từ token
    const treatments = await Treatment.find({
      expert_id,
      rating: { $ne: null }, // chỉ tính những cái đã được đánh giá
    });

    const totalRatings = treatments.length;
    const sumRatings = treatments.reduce(
      (sum, treatment) => sum + treatment.rating,
      0
    );
    const averageRating = sumRatings / totalRatings;

    // Cập nhật expert với averageRating mới
    const expert = await Expert.findByIdAndUpdate(
      expert_id,
      { average_rating: averageRating },
      { new: true } // trả về bản ghi sau khi cập nhật
    );

    return res.status(200).json({
      success: true,
      message: "Average rating updated successfully.",
      data: expert,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestTreatmentV2 = async (req, res) => {
  try {
    const user = req.payload;
    const user_id = user._id;
    const { description, duration } = req.body;
    let { start_time, end_time } = req.body;
    if (!user || !start_time || !end_time) {
      return res
        .status(404)
        .json({ success: false, message: "Not enough infomation" });
    }
    const schedule = new Schedule({
      start_time,
      end_time,
      user_id,
      status: false,
    });
    const treatment = new Treatment({
      treatmentStatus: "pending",
      schedule_id: schedule._id,
      user_id,
      description: description || "",
      duration,
    });
    await schedule.save();
    await treatment.save();
    return res.status(200).json({ success: true, treatment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.receiveTreatment = async (req, res) => {
  try {
    const {_id} = req.payload;
    const {treatment_id} = req.params;
    
  }
  catch(error){

  }
}