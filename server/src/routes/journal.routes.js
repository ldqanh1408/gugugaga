const express = require("express");
const router = express.Router();
const {authenticateJWT} = require("../middleware")
const { getNotes, addNote , updateNote } = require("../controllers/journal.controller");

// Định nghĩa route
router.get("/notes", authenticateJWT , getNotes);
router.patch("/:journalId/notes/:noteId", authenticateJWT , updateNote)
router.post("/journals/:journalId", authenticateJWT , addNote)

module.exports = router;