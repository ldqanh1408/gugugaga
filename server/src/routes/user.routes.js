const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUser,
  loadProfile,
  uploadProfile,
  getTreatment,
  updateTreatment,
  getReceivers,
  getBooking,
} = require("../controllers/user.controller");
const { upload, uploadAvatar } = require("../controllers/upload.controller");
const { authenticateJWT } = require("../middleware");
const jwt = require("../middleware/authenticateJWT");

// Định nghĩa route
router.get("/v1/users", getUsers);
router.delete("/v1/users/:userId", deleteUser);
router.get("/:userId", getUser);
router.post("/v1/users/upload", upload.single("avatar"), uploadAvatar); // Route upload ảnh
router.get(
  "/v1/users/me/treatments",
  jwt.authenticateAndAuthorize(["USER"]),
  getTreatment
);
router.get(
  "/v1/users/load-profile/:userId",
  jwt.authenticateAndAuthorize(["USER"]),
  loadProfile
);
router.patch(
  "/v1/users/upload-profile/:userId",
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
module.exports = router;
