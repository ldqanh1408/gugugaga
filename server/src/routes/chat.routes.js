const express = require("express");
const router = express.Router();
const {authenticateJWT}  = require("../middleware");
const { addMessage, getMessages } = require("../controllers/chat.controller");

// Định nghĩa route
/**
 * @swagger
 * /api/v1/chats/{chatId}/messages:
 *   get:
 *     summary: Lấy danh sách tin nhắn của một chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chat cần lấy tin nhắn
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lấy tin nhắn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *             example:
 *               success: true
 *               messages:
 *                 - content: "Xin chào"
 *                   createdAt: "2025-03-11T10:00:00Z"
 *       400:
 *         description: Thiếu hoặc sai chatId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Vui lòng cung cấp chatId hợp lệ"
 *       401:
 *         description: Người dùng chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Người dùng chưa xác thực"
 *       403:
 *         description: Người dùng không có quyền truy cập chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Bạn không có quyền truy cập chat này"
 *       404:
 *         description: Không tìm thấy chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Chat không tồn tại"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Lỗi server khi lấy tin nhắn"
 *                 error: "Database connection failed"
 */
router.get("/:chatId/messages", authenticateJWT, getMessages);

/**
 * @swagger
 * /api/v1/chats/{chatId}/messages:
 *   post:
 *     summary: Thêm một tin nhắn mới vào chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chat cần thêm tin nhắn
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: object
 *                 required:
 *                   - role
 *                   - text
 *                 properties:
 *                   role:
 *                     type: string
 *                     description: Vai trò của người gửi tin nhắn
 *                     enum: ["user", "assistant", "system"]
 *                     example: "user"
 *                   text:
 *                     type: string
 *                     description: Nội dung tin nhắn (tối đa 2000 ký tự)
 *                     maxLength: 2000
 *                     example: "Xin chào, bạn khỏe không?"
 *     responses:
 *       200:
 *         description: Thêm tin nhắn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: ["user", "assistant", "system"]
 *                     text:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               success: true
 *               message: "Thêm tin nhắn thành công"
 *       
 *       400:
 *         description: Thiếu hoặc sai thông tin đầu vào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Vui lòng cung cấp đầy đủ thông tin message (role và text)"
 *       404:
 *         description: Không tìm thấy chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Không tìm thấy chat với ID đã cung cấp"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Lỗi server khi thêm tin nhắn"
 *                 error: "Database connection failed"
 */
router.post("/:chatId/messages", authenticateJWT ,addMessage);
module.exports = router;