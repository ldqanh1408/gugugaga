const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");

// Cấu hình GridFsStorage cho Multer
const storage = new GridFsStorage({
  url: "mongodb://localhost:27017/Diary",
  file: (req, file) => {
    return {
      bucketName: "uploads", // Tên bucket cho GridFS
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});
const upload = multer({ storage });

// API xử lý upload
const uploadAvatar = (req, res) => {
  try{

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    return res.status(200).json({success: true, fileId: req.file.id }); // Trả về fileId cho frontend
  }
  catch(error){
    return res.status(500).json({succes: false, message: error.message });
  }
};

// API lấy ảnh từ GridFS
const { gfs } = require("../configs/db");

const getAvatar = async (req, res) => {
  try{

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    gfs.find({ _id: fileId }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Set headers và gửi ảnh (dưới dạng stream)
      res.set("Content-Type", files[0].contentType);
      gfs.openDownloadStream(fileId).pipe(res);
    });
  }
  catch(error){
    return res.status(500).json({success: false, message: error.message});
  }
};

module.exports = { upload, uploadAvatar, getAvatar };
