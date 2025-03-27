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
  getAvatar,
} = require("../controllers/upload.controller");

// Định nghĩa route
router.get("/", getUsers);
router.delete("/:userId", deleteUser);
router.get("/:userId", getUser);
router.post("/upload", upload.single("avatar"), uploadAvatar); // Route upload ảnh
router.get("/avatar/:fileId", getAvatar); // Route lấy ảnh từ GridFS
router.get("/load-profile/:userId", loadProfile);
router.patch("/upload-profile/:userId", uploadProfile);
module.exports = router;
