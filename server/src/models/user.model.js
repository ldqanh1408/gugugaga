const mongoose = require("mongoose");

const futureMailSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sendDate: { type: Date, required: true },
  receiveDate: { type: Date, required: true },
  notified: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  journalId: { type: mongoose.Schema.Types.ObjectId, ref: "Journal" },
  futureMails: [futureMailSchema],
});

// Thêm chỉ mục cho receiveDate để tối ưu truy vấn
userSchema.index({ "futureMails.receiveDate": 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
