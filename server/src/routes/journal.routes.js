const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware");
const {
  getNotes,
  addNote,
  updateNote,
  getEntries,
  deleteNote,
} = require("../controllers/journal.controller");

// Định nghĩa route

router.get("/:journalId/notes", authenticateJWT, getNotes);

router.patch("/:journalId/notes/:noteId", authenticateJWT, updateNote);

router.post("/:journalId/notes", authenticateJWT, addNote);

router.delete("/:journalId/notes/:noteId", authenticateJWT, deleteNote);

router.get("/:journalId/entries", authenticateJWT, getEntries);

module.exports = router;
