const express = require("express");
const router = express.Router();
const { authenticateExpertJWT, authenticateJWT } = require("../middleware");
const { requestTreatment, acceptTreatment, rejectTreatment, completeTreatment } = require("../controllers/treatment.controller");
const jwt = require("../middleware/authenticateJWT")

router.post("/v1/treatments", jwt.authenticateAndAuthorize(["USER"]), requestTreatment);
router.patch("/v1/treatments/:treatment_id/accept", jwt.authenticateAndAuthorize(["EXPERT"]), acceptTreatment);
router.patch("/v1/treatments/:treatment_id/reject", jwt.authenticateAndAuthorize(["EXPERT"]), rejectTreatment);
router.patch("/v1/treatments/:treatment_id/complete", jwt.authenticateAndAuthorize(["EXPERT"]), completeTreatment);
// router.post("v1/treatment/:treatment_id/accept", acceptTreatment)
module.exports = router;
