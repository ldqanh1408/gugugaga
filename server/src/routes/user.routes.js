const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUser,
  loadProfile,
  uploadProfile,
  getTreatment,
} = require("../controllers/user.controller");
const {
  upload,
  uploadAvatar,
} = require("../controllers/upload.controller");
const { authenticateJWT } = require("../middleware");

// Định nghĩa route
router.get("/v1/users", getUsers);
router.delete("/v1/users/:userId", deleteUser);
router.get("/:userId", getUser);
router.post("/v1/users/upload", upload.single("avatar"), uploadAvatar); // Route upload ảnh
router.get("/v1/users/me/treatments", authenticateJWT, getTreatment);
router.get("/v1/users/load-profile/:userId", loadProfile);
router.patch("/v1/users/upload-profile/:userId", uploadProfile);
module.exports = router;
