const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    expertName: {
      type: String,
    },
    gendar: {
      type: String,
      enum: ["Male", "Female", "Other"], // giả sử enum Gender có 3 giá trị
    },
    number_of_treatment: {
      type: Number,
      default: 0,
    },
    diploma_url: {
      type: String,
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    avartar_url: {
      type: String,
    },
    role: { type: String, required: true, default: "EXPERT" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expert", expertSchema);
