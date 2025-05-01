const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    description: { type: String, default: "" },
    duration: {type: String,default: ""},
    expert_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expert" }],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
