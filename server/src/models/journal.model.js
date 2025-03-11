const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), // Tạo ID tự động
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    mood: {
      type: String,
      required: true,
      enum: ["happy", "sad", "neutral", "excited", "angry"],
    },
    header: { type: String, required: true, trim: true, maxlength: 100 },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true } // Theo dõi thời gian chỉnh sửa từng note
);

const journalSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    notes: [noteSchema], // Sử dụng schema note riêng để dễ mở rộng
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
