const express = require("express");
const router = express.Router();

const {
  authenticateJWT,
  authenticateBusinessJWT,
  authenticateExpertJWT,
  jwt,
} = require("../middleware");
const {
  addExpert,
  getExperts,
  getTreatment,
  getAvailableExperts,
  updateTreatment,
  receiveBooking,
  getBookings,
} = require("../controllers/expert.controller");
router.post(
  "/v1/experts",
  jwt.authenticateAndAuthorize(["BUSINESS"]),
  addExpert
);
router.get(
  "/v1/experts",
  jwt.authenticateAndAuthorize(["BUSINESS"]),
  getExperts
);
router.get(
  "/v1/experts/me/treatments",
  jwt.authenticateAndAuthorize(["BUSINESS", "EXPERT"]),
  getTreatment
);
router.post(
  "/v1/experts/available",
  jwt.authenticateAndAuthorize(["USER"]),
  getAvailableExperts
);
router.patch(
  "/v1/experts/me/treatments/:treatment_id",
  jwt.authenticateAndAuthorize(["EXPERT"]),
  updateTreatment
);
router.get(
  "/v1/experts/me/:booking_id/receive",
  jwt.authenticateAndAuthorize(["EXPERT"]),
  receiveBooking
);
router.get(
  "/v1/experts/bookings",
  jwt.authenticateAndAuthorize(["EXPERT"]),
  getBookings
);
module.exports = router;
