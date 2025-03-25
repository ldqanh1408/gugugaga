const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    account:{type: String, required: true, unique:true},
    password: { type: String, required: true},
    userName: { type: String, required: true},
    email: { type: String},
    chatId:{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    journalId:{ type: mongoose.Schema.Types.ObjectId, ref: "Journal" },
    avatar:{type: String}
  },
  { timestamps: true } // Tự động tạo createdAt & updatedAt
);

module.exports = mongoose.model("User", userSchema);