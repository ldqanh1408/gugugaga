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
const jwt = require("../middleware/authenticateJWT")

// Định nghĩa route

router.get("/:journalId/notes", jwt.authenticateAndAuthorize(["USER"]), getNotes);

router.patch("/:journalId/notes/:noteId", jwt.authenticateAndAuthorize(["USER"]), updateNote);

router.post("/:journalId/notes", jwt.authenticateAndAuthorize(["USER"]), addNote);

router.delete("/:journalId/notes/:noteId", jwt.authenticateAndAuthorize(["USER"]), deleteNote);

router.get("/:journalId/entries", jwt.authenticateAndAuthorize(["USER"]), getEntries);

router.get("/:journalId/consecutive-days", jwt.authenticateAndAuthorize(["USER"]), getConsecutiveDays);

module.exports = router;
