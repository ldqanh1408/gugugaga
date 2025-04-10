const express = require("express");
const router = express.Router();
const {authenticateExpertJWT, authenticateJWT} = require("../middleware")
const {addTreatment} = require("../controllers/treatment.controller")

router.post("/v1/treatment", authenticateExpertJWT, authenticateJWT,addTreatment);

// router.post("v1/treatment/:treatment_id/accept", acceptTreatment)
module.exports = router