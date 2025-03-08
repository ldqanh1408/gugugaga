const Journal = require("../models/journal.model");

// Lấy danh sách users
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find();
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo user mới
exports.createJournal = async (req, res) => {
  try {
    const { userId } = req.body;
    const newJournal = new Journal({ userId });
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo user" });
  }
};