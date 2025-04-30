const mongoose = require("mongoose");

const futureMailSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    sendDate: { type: Date, required: true },
    receiveDate: { type: Date, required: true },
    notified: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: { type: Date },
    bio: { type: String },
    avatar: { type: String },
    futureMails: [futureMailSchema],
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
