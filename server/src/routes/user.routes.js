const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUser,
  loadProfile,
  uploadProfile,
  addFutureMail,
  getFutureMails,
} = require("../controllers/user.controller");
const { upload, uploadAvatar } = require("../controllers/upload.controller");
const { authenticateJWT } = require("../middleware");

// Định nghĩa route
router.get("/", getUsers);
router.delete("/:userId", deleteUser);
router.get("/:userId", getUser);
router.post("/upload", upload.single("avatar"), uploadAvatar); // Route upload ảnh
router.get("/load-profile/:userId", loadProfile);
router.patch("/upload-profile/:userId", uploadProfile);
router.post("/:userId/future-mails", authenticateJWT, addFutureMail); // Add future mail
router.get("/:userId/future-mails", authenticateJWT, getFutureMails); // Get future mails for today
module.exports = router;
