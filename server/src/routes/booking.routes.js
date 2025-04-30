const express = require("express");
const router = express.Router();
const { jwt } = require("../middleware");
const { deleteBooking, acceptBooking, requestBooking } = require("../controllers/booking.controller");

router.post(
  "/v1/bookings",
  jwt.authenticateAndAuthorize(["USER"]),
  requestBooking
);
router.delete(
  "/v1/bookings/:booking_id",
  jwt.authenticateAndAuthorize(["USER"]),
  deleteBooking
);
router.post(
  "/v1/bookings/:booking_id/accept",
  jwt.authenticateAndAuthorize(["USER"]),
  acceptBooking
);
// router.post("/v1/reason-reject")
module.exports = router;
