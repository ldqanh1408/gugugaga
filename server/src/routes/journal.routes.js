const express = require("express");
const router = express.Router();
const { authenticateJWT, validateNote } = require("../middleware");
const {
  getNotes,
  addNote,
  updateNote,
  getEntries,
  deleteNote,
  getConsecutiveDays
} = require("../controllers/journal.controller");

// Định nghĩa route

router.get("/:journalId/notes", authenticateJWT, getNotes);

router.patch("/:journalId/notes/:noteId", authenticateJWT, updateNote);

router.post("/:journalId/notes", authenticateJWT, addNote);

router.delete("/:journalId/notes/:noteId", authenticateJWT, deleteNote);

router.get("/:journalId/entries", authenticateJWT, getEntries);

router.get("/:journalId/consecutive-days", authenticateJWT, getConsecutiveDays);

module.exports = router;
