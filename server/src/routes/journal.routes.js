const express = require("express");
const router = express.Router();
const {authenticateJWT} = require("../middleware")
const { getNotes, addNote , updateNote } = require("../controllers/journal.controller");

// Định nghĩa route

router.get("/notes", authenticateJWT , getNotes);
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
 *             required:
 *               - mood
 *               - header
 *               - text
 *             properties:
 *               mood:
 *                 type: string
 *                 enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                 example: "happy"
 *               header:
 *                 type: string
 *                 example: "Ngày tuyệt vời!"
 *               text:
 *                 type: string
 *                 example: "Hôm nay tôi cảm thấy rất vui..."
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
router.put("/:journalId/notes/:noteId", authenticateJWT , updateNote);

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
 *             required:
 *               - mood
 *               - header
 *               - text
 *             properties:
 *               mood:
 *                 type: string
 *                 enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                 example: "happy"
 *               header:
 *                 type: string
 *                 example: "Một ngày đẹp trời"
 *               text:
 *                 type: string
 *                 example: "Hôm nay tôi có một ngày tuyệt vời..."
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


router.post("/journals/:journalId/notes", authenticateJWT , addNote)

/**
 * @swagger
 * /journals/{journalId}/entries:
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

router.get("/journals/:journalId/entries")

module.exports = router;