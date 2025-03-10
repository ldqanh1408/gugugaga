const express = require("express");
const router = express.Router();
const authenticateJWT  = require("../middleware/authenticateJWT");
const { addMessage, getMessages } = require("../controllers/chat.controller");

// Định nghĩa route
router.get("/:chatId/messages", authenticateJWT, getMessages);
router.post("/:chatId/messages", addMessage);
module.exports = router;