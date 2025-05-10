const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinaryConfig"); // File config đã tạo ở bước trê
const mongoose = require("mongoose");

// Cấu hình GridFsStorage cho Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 1. Xác định folder
    let folderName;
    if (file.fieldname === "avatar") {
      folderName = "avatars";
    } else {
      switch (req.payload.role) {
        case "USER":
          folderName = "users";
          break;
        case "EXPERT":
          folderName = "experts";
          break;
        case "BUSINESS":
          folderName = "business";
          break;
        default:
          folderName = "others";
      }
    }

    // 2. Xác định allowed_formats tuỳ trường hợp
    const allowedFormats = (file.fieldname === "avatar")
      ? ["jpg", "png", "mp3"]
      : ["jpg", "png", "pdf"];

    // 3. Trả về object config
    return {
      folder: folderName,
      resource_type: "auto",
      allowed_formats: allowedFormats,
    };
  },
});


const upload = multer({ storage });

// Configure CloudinaryStorage for audio uploads
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "audio", // Folder for audio files on Cloudinary
    allowed_formats: ["mp3", "wav"], // Allowed audio formats
    resource_type: "video", // Cloudinary treats audio as "video" resource type
  },
});

const uploadAudio = multer({ storage: audioStorage });

// Configure CloudinaryStorage for image uploads
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images", // Folder for image files on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // Allowed image formats
    resource_type: "image"
  },
});

const uploadImage = multer({ storage: imageStorage });

// API xử lý upload
const uploadAvatar = (req, res) => {
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

// API to handle audio upload
const uploadAudioFile = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No audio file uploaded. Request details:", req.body);
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded"
      });
    }
    if (!req.file.mimetype.startsWith('audio/')) {
      console.error("Invalid file type for audio upload. File details:", req.file);
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only audio files are allowed."
      });
    }

    res.status(200).json({
      success: true,
      message: "Audio uploaded successfully",
      url: req.file.path,
      audioUrl: req.file.path // For backwards compatibility
    });
  } catch (error) {
    console.error("Error in uploadAudioFile:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading audio file: " + (error.message || "Unknown error")
    });
  }
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


// API to handle image upload
const uploadImageFile = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No image file uploaded. Request details:", req.body);
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      console.error("Invalid file type for image upload. File details:", req.file);
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only image files are allowed."
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: req.file.path,
      imageUrl: req.file.path // For backwards compatibility
    });
  } catch (error) {
    console.error("Error in uploadImageFile:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image file: " + (error.message || "Unknown error")
    });
  }
};

const saveNote = async (req, res) => {
  try {
    const { header, date, text, mood, media } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!header || !date || !text || !mood) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: header, date, text, or mood",
      });
    }

    // Log payload để kiểm tra
    console.log("Payload received:", req.body);

    // Xử lý logic lưu note vào database
    const newNote = {
      header,
      date,
      text,
      mood,
      media: media || [], // Nếu không có media, đặt giá trị mặc định là mảng rỗng
    };

    // Giả sử bạn đang lưu note vào một journal
    const journal = await Journal.findById(req.params.journalId);
    if (!journal) {
      return res.status(404).json({ success: false, message: "Journal not found" });
    }

    journal.notes.push(newNote);
    await journal.save();

    res.status(201).json({ success: true, note: newNote });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { uploadImg, uploadAudio, upload, uploadAvatar, uploadAudioFile, uploadImage, uploadImageFile, saveNote };
