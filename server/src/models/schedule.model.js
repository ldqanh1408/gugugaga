const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    expert_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Expert",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
