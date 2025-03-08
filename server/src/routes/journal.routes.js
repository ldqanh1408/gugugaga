const express = require("express");
const router = express.Router();
const { getJournals, createJournal } = require("../controllers/journal.controller");

// Định nghĩa route
router.get("/", getJournals);
router.post("/", createJournal);

module.exports = router;