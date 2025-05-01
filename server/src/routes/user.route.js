const express = require("express");
const router = express.Router();
const {
  addFutureMail,
  getFutureMails,
  updateFutureMail,
  getTodayMails,
  markMailNotified,
} = require("../controllers/user.controller");
const { authenticateAndAuthorize } = require("../middleware/authenticateJWT");

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

module.exports = router;
