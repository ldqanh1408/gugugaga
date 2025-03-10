const express = require("express");
const router = express.Router();
const {authenticateJWT}  = require("../middleware");
const { addMessage, getMessages } = require("../controllers/chat.controller");

// Định nghĩa route
router.get("/:chatId/messages", authenticateJWT, getMessages);
router.post("/:chatId/messages", authenticateJWT ,addMessage);
module.exports = router;