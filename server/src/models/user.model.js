const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    account:{type: String, required: true, unique: true},
    chatId:{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    journalId:{ type: mongoose.Schema.Types.ObjectId, ref: "Journal" },
    userName: { type: String, required: true, unique: true},
    email: { type: String, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Tự động tạo createdAt & updatedAt
);

module.exports = mongoose.model("User", userSchema);