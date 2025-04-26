const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    expert_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    summary: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5, // giả định kiểu `rate` là số sao đánh giá
    },
    feedback: {
      type: String,
      trim: true,
    },
    complaint: {
      type: String,
      trim: true,
    },
    treatmentStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      required: true,
    },
    schedule_id: {
      type:  mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Schedule",
    },
    reason_reject: {
      type: String,
      trim: true,
    },
    business_id: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    duration: {
      type: String,
      trim: true,
    },
    description : {
      type: String,
      trim: true
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
