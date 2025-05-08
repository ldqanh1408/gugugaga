const express = require("express");
const router = express.Router();

const {
  addFutureMail,
  getFutureMails,
  updateFutureMail,
  getTodayMails,
  markMailNotified,
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
  "/v1/media",
  jwt.authenticateAndAuthorize(["USER"]),
  uploadAudio.single("file"),
  uploadAudioFile
);
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

router.patch(
  "/v1/users/:userId/future-mails/:mailId/notify",
  authenticateAndAuthorize(["USER"]),
  markMailNotified
);

module.exports = router;
