const Journal = require("../models/journal.model");
const {findJournalByUserId} = require("../services/journal.service")
// Lấy danh sách users
exports.getNotes = async (req, res) => {
  try {
    const {journalId} = req.body;
    const journal = Journal.findOne({_id: journalId});

    res.json(journal.notes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.addNote = async (req, res) => {
  try {
    const {journalId, note} = req.body;
    const journal = Journal.findOne({_id: journalId});
    journal.notes = [...journal.notes, note];
    await journal.save();
    return res.status(200).json({success: true, message: "Thêm note thành công"});
  }
  catch(error){
    return res.status(404).json({success: false, message: error.message});
  }
}

exports.updateNote = async (req, res) => {
  try{
    const {journalId, note} = req.body;
    const journal = Journal.findOne({_id : journalId});
    if(!journal){
      return res.status(400).json({success: false, message: error.message});
    }
    const noteId = note.noteId;
    const index = journal.notes.findIndex((note) => note.noteId === noteId);
    journal.notes[index] = note;
    await journal.save();
    return res.status(200).json({success: true, message : "Sửa note thành công"});
  }
  catch(error){
    return res.status(400).json({success: false, message: error.message});
  }
}

exports.getEntries = async (req, res) => {
  try{
    const journalId = req.body;
    const journal = findOne({_id:journalId});
    const entries = new Set();
    const dates = journal.notes.reduce((accumulate ,note) => {
      return [...accumulate, note.date];
    }, []);
    dates.forEach((date) => {
      entries.add(date);
    });
    return res.status(200).json({success: true, entries: [...entries]});
  }
  catch(error){
    return res.status(400).json({success: false, message: error.message});
  }
}

//sx danh sách liên kết đơn