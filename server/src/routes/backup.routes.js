const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const User = require("../models/user.model");
const path = require("path");

const dbName = "Diary"; // Thay bằng tên database của bạn
const dumpPath = path.join(__dirname, "..", "backup"); // Tạo đường dẫn chuẩn
const dumpPathImport = path.join(__dirname, "..", "backup", "Diary"); // Tạo đường dẫn chuẩn

router.get("/export/dump", async (req, res) => {
  await exec(`mongodump --db ${dbName} --out ${dumpPath}`, (error) => {
    if (error) {
      console.error("Lỗi khi tạo dump MongoDB:", error);
      return res.status(500).send("Lỗi khi tạo file dump.");
    }
  });
  return res
    .status(200)
    .json({ success: true, message: "backup success", dumpPath: dumpPath });
});

router.get("/import/dump", async (req, res) => {
  const restoreCommand = `mongorestore --drop --db ${dbName} ${dumpPathImport}`;
  await exec(restoreCommand, (error, stdout, stderr) => {
    console.log("Chạy");
    if (error) {
      return res
        .status(500)
        .json({ message: `❌ Lỗi khi restore dữ liệu: ${error.message}` });
    }
    if (stderr) {
      return res
        .status(500)
        .json({ message: `Lỗi khi restore dữ liệu: ${error.message}` });
    }
  });
  return res
    .status(200)
    .json({
      success: true,
      message: "✅ Restore dữ liệu thành công!",
      dumpPathImport: dumpPathImport,
    });
});

module.exports = router;
