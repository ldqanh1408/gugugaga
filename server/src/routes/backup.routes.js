const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const User = require("../models/user.model");

const dbName = "Diary"; // Thay bằng tên database của bạn
const dumpPath = `./src/backup`; // Thay đường dẫn tới thư mục dump

/**
 * @swagger
 * api/v1/backup/export/dump:
 *   get:
 *     summary: Tạo file dump (backup) của cơ sở dữ liệu MongoDB
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Backup database được khởi tạo (không đảm bảo hoàn thành)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "backup success"
 *       500:
 *         description: Lỗi server khi tạo dump
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "Lỗi khi tạo file dump."
 */
router.get("/export/dump", async (req, res) => {
    exec(`mongodump --db ${dbName} --out ${dumpPath}`, (error) => {
        if (error) {
            console.error("Lỗi khi tạo dump MongoDB:", error);
            return res.status(500).send("Lỗi khi tạo file dump.");
        }
    });
    return res.status(200).json({success: true, message: "backup success"})
}); 



/**
 * @swagger
 * /api/v1/backup/import/dump:
 *   get:
 *     summary: Khôi phục (restore) cơ sở dữ liệu từ file dump
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Restore dữ liệu được khởi tạo (không đảm bảo hoàn thành)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "✅ Restore dữ liệu thành công!"
 *       500:
 *         description: Lỗi server khi restore dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "❌ Lỗi khi restore dữ liệu: mongorestore command failed"
 */
router.get("/import/dump", async (req, res) => {
      
    const restoreCommand = `mongorestore --drop --db ${dbName} ${dumpPath}/Diary`;

    exec(restoreCommand, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({message: `❌ Lỗi khi restore dữ liệu: ${error.message}`});
        }
        if (stderr) { 
            return res.status(500).json({message: `Lỗi khi restore dữ liệu: ${error.message}`});
        }
    });
    return res.status(200).json({success: true, message: "✅ Restore dữ liệu thành công!"})
}) 
 
module.exports = router; 