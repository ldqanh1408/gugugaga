const express = require("express");
const router = express.Router();

const { authenticateJWT, authenticateBusinessJWT } = require("../middleware");
const jwt = require("../middleware/authenticateJWT");
const businessController = require("../controllers/business.controller")
router.delete(
  "/v1/business/me/experts/:expert_id",
  jwt.authenticateAndAuthorize(["BUSINESS"]),
  businessController.deleteExpert
);

router.patch(
  "/v1/business/me/experts/:expert_id",
  jwt.authenticateAndAuthorize(["BUSINESS"]),
  businessController.updatedExpert
);

router.get(
  "/v1/business/me/complaints",
  jwt.authenticateAndAuthorize(["BUSINESS"]),
  businessController.getComplaints
);

module.exports = router;
