const express = require("express");
const router = express.Router();
const { authenticateJWT, validateMessage } = require("../middleware");
const { addMessage, getMessages, deleteMessage, updateMessage } = require("../controllers/chat.controller");
const {jwt} = require("../middleware");
const { authenticateAndAuthorize } = require("../middleware/authenticateJWT");

// Định nghĩa route

router.get("/:chatId/messages" ,authenticateAndAuthorize(["USER"]), getMessages);

router.post("/:chatId/messages", authenticateAndAuthorize(["USER"]), addMessage);

router.delete("/:chatId/messages/:messageId", authenticateAndAuthorize(["USER"]), deleteMessage);

router.patch("/:chatId/messages/:messageId", validateMessage ,authenticateAndAuthorize(["USER"]), updateMessage);

module.exports = router;
