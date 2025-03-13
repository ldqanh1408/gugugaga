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
        message: "Vui lòng cung cấp journalId" 
      });
    }

    // Tìm journal trong database
    const journal = await Journal.findOne({ _id: journalId });
    
    // Kiểm tra xem journal có tồn tại không
    if (!journal) {
      return res.status(404).json({ 
        message: "Không tìm thấy journal với ID đã cung cấp" 
      });
    }

    // Trả về notes
    return res.status(200).json(journal.notes);

  } catch (error) {
    // Log error để debug (trong môi trường production)
    console.error('Error in getNotes:', error);
    
    return res.status(500).json({ 
      message: "Lỗi server khi lấy notes",
      error: error.message 
    });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { journalId } = req.params;
    const { note } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!journalId || !note) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Thiếu thông tin journalId hoặc note",
        });
    }

    // Tìm journal
    const journal = await Journal.findOne({ _id: journalId });
    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy journal" });
    }

    // Tạo ID cho note nếu chưa có
    const newNote = {
      date: note.date || new Date(),
      mood: note.mood,
      header: note.header,
      text: note.text,
    };

    // Thêm note vào journal

    journal.notes = [...journal.notes, note];
    await journal.save();
    return res
      .status(200)
      .json({ success: true, message: "Thêm note thành công" });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { journalId, noteId } = req.params;
    const { note } = req.body;
    if (!journalId || !note || !noteId) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin cần thiết" });
    }
    const journal = await Journal.findOne({ _id: journalId });
    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy journal" });
    }

    const index = journal.notes.findIndex((note) => note._id.toString() === noteId.toString());
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy note" });
    }
    journal.notes[index] = note;
    await journal.save();
    return res
      .status(200)
      .json({ success: true, message: "Sửa note thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật note:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ, thử lại sau" });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const {journalId} = req.params;
    
    const journal = await Journal.findOne({ _id: journalId });
    if (!journal) {
      return res.status(404).json({ success: false, message: "Không tìm thấy journal" });
    }
    // ✅ Lấy danh sách các ngày từ notes, loại bỏ trùng lặp
    const entries = [...new Set(journal.notes.map(note => note.date.toISOString().split("T")[0]))]

    return res.status(200).json({ success: true, entries: entries });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//sx danh sách liên kết đơn
