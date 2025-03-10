const express = require("express");
const router = express.Router();
const { exec } = require("child_process");


router.get("/export/dump",(req, res) => {
    const dumpPath = "./dump/backup";
    
    exec(`mongodump --db Diary --out ${dumpPath}`, (error) => {
        if (error) {
            console.error("Lỗi khi tạo dump MongoDB:", error);
            return res.status(500).send("Lỗi khi tạo file dump.");
        }

        res.download(`${dumpPath}/Diary`, "mongodb_backup.zip", (err) => {
            if (err) console.error("Lỗi khi gửi file:", err);
        });
    });
});

module.exports = router;