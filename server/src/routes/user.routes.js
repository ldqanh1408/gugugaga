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
  updateFutureMail,
  getTodayMails,
  markMailNotified,
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
const { authenticateAndAuthorize } = require("../middleware/authenticateJWT");

// Định nghĩa route
router.get("/v1/users", getUsers);
router.delete("/v1/users/:userId", deleteUser);
router.get("/v1/users/me", getUser);

// Future mails
router.post(
  "/v1/users/:userId/future-mails",
  authenticateAndAuthorize(["USER"]),
  addFutureMail
);
router.get(
  "/v1/users/:userId/future-mails",
  authenticateAndAuthorize(["USER"]),
  getFutureMails
);
router.patch(
  "/v1/users/:userId/future-mails/:mailId",
  authenticateAndAuthorize(["USER"]),
  updateFutureMail
);
router.get(
  "/v1/users/:userId/today-mails",
  authenticateAndAuthorize(["USER"]),
  getTodayMails
);
router.patch(
  "/v1/users/:userId/future-mails/:mailId/notify",
  authenticateAndAuthorize(["USER"]),
  markMailNotified
);

// Route upload avatar
router.post(
  "/v1/users/upload",
  authenticateAndAuthorize(["USER"]),
  upload.single("avatar"),
  uploadAvatar
);

router.get(
  "/v1/users/me/treatments",
  authenticateAndAuthorize(["USER"]),
  getTreatment
);

router.get(
  "/v1/users/load-profile",
  authenticateAndAuthorize(["USER"]),
  loadProfile
);

router.patch(
  "/v1/users/upload-profile",
  authenticateAndAuthorize(["USER"]),
  uploadProfile
);

router.patch(
  "/v1/users/me/treatments/:treatment_id",
  authenticateAndAuthorize(["USER"]),
  updateTreatment
);

router.get(
  "/v1/users/me/receivers",
  authenticateAndAuthorize(["USER"]),
  getReceivers
);

router.get(
  "/v1/users/me/bookings",
  authenticateAndAuthorize(["USER"]),
  getBooking
);

// Route for uploading audio files
router.post(
  "/v1/media",
  authenticateAndAuthorize(["USER"]),
  uploadAudio.single("file"),
  uploadAudioFile
);
router.post(
  "/v1/upload-audio",
  authenticateAndAuthorize(["USER"]),
  uploadAudio.single("audio"),
  uploadAudioFile
);

// Route for uploading image files
router.post(
  "/v1/upload-image",
  authenticateAndAuthorize(["USER"]),
  uploadImage.single("image"),
  uploadImageFile
);

module.exports = router;