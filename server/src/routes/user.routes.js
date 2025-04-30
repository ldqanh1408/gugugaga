const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const upload = require("../controllers/upload.controller");
const { authenticateAndAuthorize } = require("../middleware/authenticateJWT");

// Future mail routes
router
  .route("/v1/users/:userId/future-mails")
  .get(authenticateAndAuthorize(["USER"]), userController.getFutureMails)
  .post(authenticateAndAuthorize(["USER"]), userController.addFutureMail);

router
  .route("/v1/users/:userId/future-mails/:mailId")
  .patch(authenticateAndAuthorize(["USER"]), userController.updateFutureMail);

// Các routes khác
router.get("/v1/users", userController.getUsers);
router.get(
  "/v1/users/:userId",
  authenticateAndAuthorize(["USER"]),
  userController.getUser
);
router.delete(
  "/v1/users/:userId",
  authenticateAndAuthorize(["USER"]),
  userController.deleteUser
);

router.get(
  "/v1/users/me/treatments",
  authenticateAndAuthorize(["USER"]),
  userController.getTreatment
);
router.get(
  "/v1/users/load-profile",
  authenticateAndAuthorize(["USER"]),
  userController.loadProfile
);
router.patch(
  "/v1/users/upload-profile",
  authenticateAndAuthorize(["USER"]),
  userController.uploadProfile
);
router.get(
  "/v1/users/me/receivers",
  authenticateAndAuthorize(["USER"]),
  userController.getReceivers
);
router.get(
  "/v1/users/me/bookings",
  authenticateAndAuthorize(["USER"]),
  userController.getBooking
);

// Upload route
router.post(
  "/v1/users/upload",
  authenticateAndAuthorize(["USER"]),
  upload.upload.single("avatar"),
  upload.uploadAvatar
);

module.exports = router;
