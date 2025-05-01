const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "BUSINESS" },
    business_name: { type: String, required: true, unique: true },
    business_email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Business", businessSchema);
