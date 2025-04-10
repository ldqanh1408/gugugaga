const express = require("express");
const router = express.Router();
const { authenticateExpertJWT, authenticateJWT } = require("../middleware");
const { requestTreatment, acceptTreatment, rejectTreatment, completeTreatment } = require("../controllers/treatment.controller");

router.post("/v1/treatments", authenticateJWT, requestTreatment);
router.patch("/v1/treatments/:treatment_id/accept", authenticateExpertJWT, acceptTreatment);
router.patch("/v1/treatments/:treatment_id/reject", authenticateExpertJWT, rejectTreatment);
router.patch("/v1/treatments/:treatment_id/complete", authenticateExpertJWT, completeTreatment);
// router.post("v1/treatment/:treatment_id/accept", acceptTreatment)
module.exports = router;
