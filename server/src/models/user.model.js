const mongoose = require("mongoose");

const futureMailSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sendDate: { type: Date, required: true },
  receiveDate: { type: Date, required: true },
  notified: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  reply: { type: String, default: "" }
});

const userSchema = new mongoose.Schema(
  {
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, unique: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    journalId: { type: mongoose.Schema.Types.ObjectId, ref: "Journal" },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    futureMails: [futureMailSchema],
    role: {type: String, required: true, default: "USER"},
    bio: {type: String},
    dob: {type: Date},
    phone: {type: String, unique: true},  
    avatar: {type: String}  
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
