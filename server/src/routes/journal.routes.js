const express = require("express");
const router = express.Router();
const {authenticateJWT} = require("../middleware")
const { getNotes, addNote , updateNote, getEntries } = require("../controllers/journal.controller");

// Định nghĩa route
/**
 * @swagger
 * /api/v1/journals/{journalId}/notes:
 *   get:
 *     summary: Lấy notes của một journal
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journal cần lấy notes
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lấy notes thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - mood
 *                   - header
 *                   - text
 *                 properties:
 *                   mood:
 *                     type: string
 *                     enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                     example: "happy"
 *                   header:
 *                     type: string
 *                     example: "Ngày tuyệt vời!"
 *                   text:
 *                     type: string
 *                     example: "Hôm nay tôi cảm thấy rất vui..."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-11T10:00:00Z"
 *             example:
 *               - mood: "happy"
 *                 header: "Ngày tuyệt vời!"
 *                 text: "Hôm nay tôi cảm thấy rất vui..."
 *                 createdAt: "2025-03-11T10:00:00Z"
 *               - mood: "sad"
 *                 header: "Ngày buồn"
 *                 text: "Mọi thứ không như mong đợi..."
 *                 createdAt: "2025-03-11T12:00:00Z"
 *       400:
 *         description: Thiếu journalId trong request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Vui lòng cung cấp journalId"
 *       404:
 *         description: Không tìm thấy journal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Không tìm thấy journal với ID đã cung cấp"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 message: "Lỗi server khi lấy notes"
 *                 error: "Database connection failed"
 */

router.get("/:journalId/notes", authenticateJWT , getNotes);
/**
 * @swagger
 * /api/v1/journal/{journalId}/note/{noteId}:
 *   put:
 *     summary: Cập nhật một ghi chú trong journal
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của journal chứa note
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của note cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: object
 *                 required:
 *                   - mood
 *                   - header
 *                   - text
 *                 properties:
 *                   mood:
 *                     type: string
 *                     enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                     example: "happy"
 *                   header:
 *                     type: string
 *                     example: "Một ngày đẹp trời"
 *                   text:
 *                     type: string
 *                     example: "Hôm nay tôi có một ngày tuyệt vời..."
 *     responses:
 *       200:
 *         description: Sửa note thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy journal hoặc note
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/:journalId/notes/:noteId", authenticateJWT , updateNote);

/**
 * @swagger
 * /api/v1/journal/{journalId}/notes:
 *   post:
 *     summary: Thêm ghi chú mới vào journal
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của journal cần thêm note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: object
 *                 required:
 *                   - mood
 *                   - header
 *                   - text
 *                 properties:
 *                   mood:
 *                     type: string
 *                     enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                     example: "happy"
 *                   header:
 *                     type: string
 *                     example: "Một ngày đẹp trời"
 *                   text:
 *                     type: string
 *                     example: "Hôm nay tôi có một ngày tuyệt vời..."
 *     responses:
 *       201:
 *         description: Thêm note thành công
 *       400:
 *         description: Thiếu dữ liệu đầu vào
 *       404:
 *         description: Không tìm thấy journal
 *       500:
 *         description: Lỗi máy chủ
 */


router.post("/:journalId/notes", authenticateJWT , addNote)

/**
 * @swagger
 * api/v1/journals/{journalId}/entries:
 *   get:
 *     summary: Lấy danh sách ngày có ghi chú trong journal
 *     tags: [Journal]
 *     description: |
 *       API này trả về danh sách các ngày có ghi chú (`note`) trong một journal nhất định.
 *       Ngày trả về theo định dạng `YYYY-MM-DD`, không lặp lại.
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journal cần lấy danh sách ngày có ghi chú.
 *     responses:
 *       200:
 *         description: Trả về danh sách ngày có ghi chú.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "2024-03-11"
 *       404:
 *         description: Không tìm thấy journal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy journal"
 *       500:
 *         description: Lỗi máy chủ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ, thử lại sau"
 */

router.get("/:journalId/entries", authenticateJWT, getEntries);

module.exports = router;