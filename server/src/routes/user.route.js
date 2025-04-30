const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/user.controller");

// User routes
router.get("/", auth.authToken, userController.getUsers);
router.get("/me/treatments", auth.authToken, userController.getTreatment);
router.get("/me/bookings", auth.authToken, userController.getBooking);
router.get("/me/receivers", auth.authToken, userController.getReceivers);
router.get("/:userId", auth.authToken, userController.getUser);
router.delete("/:userId", auth.authToken, userController.deleteUser);

// Profile routes
router.get("/load-profile", auth.authToken, userController.loadProfile);
router.patch("/upload-profile", auth.authToken, userController.uploadProfile);

// Future mail routes
router.post(
  "/:userId/future-mails",
  auth.authToken,
  userController.addFutureMail
);
router.get(
  "/:userId/future-mails",
  auth.authToken,
  userController.getFutureMails
);
router.patch(
  "/:userId/future-mails/:mailId",
  auth.authToken,
  userController.updateFutureMail
);

module.exports = router;
