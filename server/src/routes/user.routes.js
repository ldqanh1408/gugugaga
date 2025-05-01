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
  getTreatment,
  updateTreatment,
  getReceivers,
  getBooking,
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
const jwt = require("../middleware/authenticateJWT");

// Định nghĩa route
router.get("/v1/users", getUsers);
router.delete("/v1/users/:userId", deleteUser);
router.get("/v1/users/me", getUser);

// Future mails (commented out)
// router.post("/:userId/future-mails", authenticateJWT, addFutureMail);
// router.get("/:userId/future-mails", authenticateJWT, getFutureMails);

// Route upload avatar
router.post(
  "/v1/users/upload",
  jwt.authenticateAndAuthorize(["USER"]),
  upload.single("avatar"),
  uploadAvatar
);

router.get(
  "/v1/users/me/treatments",
  jwt.authenticateAndAuthorize(["USER"]),
  getTreatment
);

router.get(
  "/v1/users/load-profile",
  jwt.authenticateAndAuthorize(["USER"]),
  loadProfile
);

router.patch(
  "/v1/users/upload-profile",
  jwt.authenticateAndAuthorize(["USER"]),
  uploadProfile
);

router.patch(
  "/v1/users/me/treatments/:treatment_id",
  jwt.authenticateAndAuthorize(["USER"]),
  updateTreatment
);

router.get(
  "/v1/users/me/receivers",
  jwt.authenticateAndAuthorize(["USER"]),
  getReceivers
);

router.get(
  "/v1/users/me/bookings",
  jwt.authenticateAndAuthorize(["USER"]),
  getBooking
);

// Route for uploading audio files
router.post(
  "/v1/upload-audio",
  jwt.authenticateAndAuthorize(["USER"]),
  uploadAudio.single("audio"),
  uploadAudioFile
);

// Route for uploading image files
router.post(
  "/v1/upload-image",
  jwt.authenticateAndAuthorize(["USER"]),
  uploadImage.single("image"),
  uploadImageFile
);

module.exports = router;
