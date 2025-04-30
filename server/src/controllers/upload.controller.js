const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinaryConfig"); // File config đã tạo ở bước trê
const mongoose = require("mongoose");

// Cấu hình GridFsStorage cho Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "others"; // default
    if (req.payload.role === "USER") folderName = "users";
    if (req.payload.role === "EXPERT") folderName = "experts";
    if (req.payload.role === "BUSINESS") folderName = "business";

    return {
      folder: folderName,
      resource_type: "auto", // <-- thêm dòng này để cho phép PDF và các định dạng khác
      allowed_formats: ["jpg", "png", "pdf"],
    };
  },
});

const upload = multer({ storage });

// API xử lý upload
uploadAvatar = (req, res) => {
  if (!req.file || !req.file.path) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded or path missing" });
  } 

  res.status(200).json({
    success: true,
    message: "Ảnh đã được upload thành công!",
    imageUrl: req.file.path || req.file.filename || req.file.secure_url, // Lấy secure_url (ưu tiên)
  });
};



const uploadImg = (req, res) => {
  if (!req.file || !req.file.path) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded or path missing" });
  }

  res.status(200).json({
    success: true,
    message: "Ảnh đã được upload thành công!",
    data: req.file.path || req.file.filename || req.file.secure_url, // Lấy secure_url (ưu tiên)
  });
};


module.exports = { upload, uploadAvatar, uploadImg };
