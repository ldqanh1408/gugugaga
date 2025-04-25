const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUser,
  loadProfile,
  uploadProfile,
} = require("../controllers/user.controller");
const {
  upload,
  uploadAvatar,
  uploadAudio,
  uploadAudioFile,
  uploadImage,
  uploadImageFile,
} = require("../controllers/upload.controller");
const { authenticateJWT } = require("../middleware");

// Định nghĩa route
router.get("/", getUsers);
router.delete("/:userId", deleteUser);
router.get("/:userId", getUser);
router.post("/upload", upload.single("avatar"), uploadAvatar); // Route upload ảnh
router.get("/load-profile/:userId", loadProfile);
router.patch("/upload-profile/:userId", uploadProfile);

// Route for uploading audio files
router.post("/upload-audio", uploadAudio.single("audio"), uploadAudioFile);

// Route for uploading image files
router.post("/upload-image", uploadImage.single("image"), uploadImageFile);

module.exports = router;
