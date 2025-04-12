const express = require("express");
const router = express.Router();

const { authenticateJWT, authenticateBusinessJWT, authenticateExpertJWT } = require("../middleware");
const { addExpert, getExperts, getTreatment, getAvailableExperts } = require("../controllers/expert.controller");


router.post("/v1/experts", authenticateBusinessJWT,addExpert);
router.get("/v1/experts",authenticateBusinessJWT, getExperts);
router.get("/v1/experts/me/treatments", authenticateExpertJWT, getTreatment);
router.post("/v1/experts/available", getAvailableExperts  );
module.exports = router