const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
  role: {type: String, required: true },
  text: {type: String, required: true},
}, { timestamps: true });  // ✅ Tự động thêm `createdAt` và `updatedAt`


const chatSchema = new mongoose.Schema(
  {
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages:[messageSchema],
  },
  { timestamps: true } // Tự động tạo createdAt & updatedAt
);

module.exports = mongoose.model("Chat", chatSchema);