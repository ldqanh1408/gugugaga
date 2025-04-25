const Journal = require("../models/journal.model");
const { findJournalByUserId } = require("../services/journal.service");
const mongoose = require("mongoose");

// Lấy danh sách users
exports.getNotes = async (req, res) => {
  try {
    const { journalId } = req.params;

    // Kiểm tra dữ liệu đầu vào
    if (!journalId) {
      return res.status(400).json({
        message: "Vui lòng cung cấp journalId",
      });
    }

    // Tìm journal trong database
    const journal = await Journal.findOne({ _id: journalId });

    // Kiểm tra xem journal có tồn tại không
    if (!journal) {
      return res.status(404).json({
        message: "Không tìm thấy journal với ID đã cung cấp",
      });
    }

    // Trả về notes
    return res.status(200).json(journal.notes);
  } catch (error) {
    // Log error để debug (trong môi trường production)
    console.error("Error in getNotes:", error);

    return res.status(500).json({
      message: "Lỗi server khi lấy notes",
      error: error.message,
    });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { journalId } = req.params;
    const { header, date, text, mood, media } = req.body;

    console.log("Received payload:", req.body); // Log payload để kiểm tra

    // Validate required fields
    if (!header || !date || !text || !mood) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: header, date, text, or mood",
      });
    }

    // Find the journal by ID
    const journal = await Journal.findById(journalId);
    if (!journal) {
      return res.status(404).json({ success: false, message: "Journal not found" });
    }

    // Create a new note
    const newNote = { header, date, text, mood, media: media || [] };
    journal.notes.push(newNote);

    // Save the journal
    const savedJournal = await journal.save();

    // Get the newly created note (last note in the ar  ray)
    const createdNote = savedJournal.notes[savedJournal.notes.length - 1];

    res.status(201).json({ success: true, note: createdNote });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { journalId, noteId } = req.params;
    const updateData = req.body; // Nhận payload phẳng

    if (!journalId || !noteId) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin cần thiết" });
    }

    // Validate required fields
    if (!updateData.header || !updateData.date || !updateData.text || !updateData.mood) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: header, date, text, or mood",
      });
    }

    const journal = await Journal.findOneAndUpdate(
      { _id: journalId, "notes._id": noteId },
      {
        $set: {
          "notes.$.header": updateData.header,
          "notes.$.date": updateData.date,
          "notes.$.text": updateData.text,
          "notes.$.mood": updateData.mood,
          "notes.$.media": updateData.media || [],
        }
      },
      { new: true }
    );

    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy journal" });
    }
    const updatedNote = journal.notes.find(n => n._id.toString() === noteId);

    return res
      .status(200)
      .json({ success: true, message: "Sửa note thành công", note: updatedNote });
  } catch (error) {
    console.error("Lỗi khi cập nhật note:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi máy chủ, thử lại sau",
        error: error.message,
      });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const { journalId } = req.params;

    const journal = await Journal.findOne({ _id: journalId });
    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy journal" });
    }
    // ✅ Lấy danh sách các ngày từ notes, loại bỏ trùng lặp
    const entries = [
      ...new Set(
        journal.notes.map((note) => note.createdAt.toISOString().split("T")[0])
      ),
    ];

    return res.status(200).json({ success: true, entries: entries });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { noteId, journalId } = req.params;
    if (!noteId || !journalId) {
      return res
        .status(404)
        .json({ success: false, message: "Thiếu thông tin" });
    }
    const journal = await Journal.findOneAndUpdate(
      { _id: journalId, "notes._id": noteId },
      { $pull: { notes: { _id: noteId } } },
      { new: false } // Trả về document TRƯỚC khi cập nhật
    );


    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal không tồn tại hoặc không chứa noteId",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Đã xóa thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConsecutiveDays = async (req, res) => {
  try {
    const { journalId } = req.params;

    const journal = await Journal.findOne({ _id: journalId });
    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy journal" });
    }
    if(journal.notes.length === 0) return res.status(200).json({success: true, consecutiveDays: 0});
    const dates = journal.notes.map(note => note.date.toISOString().split('T')[0]);
    const uniqueDates = [...new Set(dates)].sort();
    let maxStreak = 1, currentStreak = 1;
    for(let i = 1; i <= uniqueDates.length; i++){
      const prevDate = new Date(uniqueDates[i - 1]);
      const curDate = new Date(uniqueDates[i]);
      const diffInDate = (curDate - prevDate) / (1000 * 60 * 60 * 24);
      if(diffInDate === 1){
        currentStreak++;
        maxStreak = Math.max(currentStreak, maxStreak);
      } 
      else currentStreak = 1;
    }
    return res.status(200).json({succes: true, consecutiveDays: maxStreak});
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}