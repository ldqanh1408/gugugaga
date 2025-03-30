const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinaryConfig"); // File config đã tạo ở bước trê
const mongoose = require("mongoose");

// Cấu hình GridFsStorage cho Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars", // Thư mục lưu ảnh trên Cloudinary
    allowed_formats: ["jpg", "png"], // Giới hạn định dạng file
  },
});

const upload = multer({ storage });

// API xử lý upload
const uploadAvatar = (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: "No file uploaded or path missing" });
  }

  res.status(200).json({
    success: true,
    message: "Ảnh đã được upload thành công!",
    imageUrl: req.file.path || req.file.filename || req.file.secure_url, // Lấy secure_url (ưu tiên)
  });
};



module.exports = { upload, uploadAvatar };
