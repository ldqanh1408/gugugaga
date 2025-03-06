const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: [{date: Date, mood: String, header: String, text: String}]
  },
  { timestamps: true } // Tự động tạo createdAt & updatedAt
);

module.exports = mongoose.model("Journal", journalSchema);