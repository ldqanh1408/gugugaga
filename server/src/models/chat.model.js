const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages:[{type: String}]
  },
  { timestamps: true } // Tự động tạo createdAt & updatedAt
);

module.exports = mongoose.model("Chat", userSchema);