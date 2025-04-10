const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    account:{type: String, required: true, unique:true},
    password: { type: String, required: true},
    userName: { type: String, required: true},
    email: { type: String, unique: true},
    chatId:{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    journalId:{ type: mongoose.Schema.Types.ObjectId, ref: "Journal" },
    gender:{
      type: String,
      enum: ["male", "female", "other"],
    },
    bio:{type: String},
    dob:{type: Date},
    phone:{type: String, unique:true},  
    avatar:{type: String}  
  },
  { timestamps: true } // Tự động tạo createdAt & updatedAt
);

module.exports = mongoose.model("User", userSchema);