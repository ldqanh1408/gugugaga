const express = require("express");
const router = express.Router();
const { getNotes, addNote , updateNote } = require("../controllers/journal.controller");

// Định nghĩa route
router.get("/notes", getNotes);
router.patch("/:journalId/notes/:noteId", updateNote)
router.post("/journals/:journalId", addNote)

module.exports = router;