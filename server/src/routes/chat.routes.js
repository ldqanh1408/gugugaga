const express = require("express");
const router = express.Router();
const { getChats, createChat } = require("../controllers/chat.controller");

// Định nghĩa route
router.get("/", getChats);
router.post("/", createChat);

module.exports = router;