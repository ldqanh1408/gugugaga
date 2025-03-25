const express = require("express");
const router = express.Router();
const { authenticateJWT, validateMessage } = require("../middleware");
const { addMessage, getMessages, deleteMessage, updateMessage } = require("../controllers/chat.controller");

// Định nghĩa route

router.get("/:chatId/messages" ,authenticateJWT, getMessages);

router.post("/:chatId/messages", authenticateJWT, addMessage);

router.delete("/:chatId/messages/:messageId", authenticateJWT, deleteMessage);

router.patch("/:chatId/messages/:messageId", validateMessage ,authenticateJWT, updateMessage);
module.exports = router;
