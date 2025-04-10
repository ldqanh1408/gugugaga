const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    expert_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Expert",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
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
      type: String,
      required: true,
      unique: true,
      ref: "Schedule",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
