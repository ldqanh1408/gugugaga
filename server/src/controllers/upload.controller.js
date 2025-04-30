const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinaryConfig"); // File config đã tạo ở bước trê
const mongoose = require("mongoose");

// Cấu hình GridFsStorage cho Multer
const storage = new CloudinaryStorage({
  cloudinary,
<<<<<<< HEAD
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
=======
  params: {
    folder: "avatars", // Thư mục lưu ảnh trên Cloudinary
    allowed_formats: ["jpg", "png", "mp3"], // Giới hạn định dạng file
>>>>>>> testQA
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

// API to handle audio upload
const uploadAudioFile = (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No file uploaded or path missing" });
    }

    res.status(200).json({
      success: true,
      message: "Audio file uploaded successfully!",
      audioUrl: req.file.path || req.file.secure_url, // Return secure_url
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    res.status(500).json({ success: false, message: "Server error during audio upload" });
  }
};

<<<<<<< HEAD
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
=======
// API to handle image upload
const uploadImageFile = (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No file uploaded or path missing" });
    }

    res.status(200).json({
      success: true,
      message: "Image file uploaded successfully!",
      imageUrl: req.file.path || req.file.secure_url, // Return secure_url
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Server error during image upload" });
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

module.exports = { upload, uploadAvatar, uploadAudio, uploadAudioFile, uploadImage, uploadImageFile, saveNote };
>>>>>>> testQA
