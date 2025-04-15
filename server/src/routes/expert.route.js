const express = require("express");
const router = express.Router();

const { authenticateJWT, authenticateBusinessJWT, authenticateExpertJWT, jwt } = require("../middleware");
const { addExpert, getExperts, getTreatment, getAvailableExperts } = require("../controllers/expert.controller");
console.log(jwt)
router.post("/v1/experts", jwt.authenticateAndAuthorize(['BUSINESS']),addExpert);
router.get("/v1/experts",jwt.authenticateAndAuthorize(['BUSINESS']), getExperts);
router.get("/v1/experts/me/treatments", jwt.authenticateAndAuthorize(['BUSINESS', 'EXPERT']), getTreatment);
router.post("/v1/experts/available", getAvailableExperts  );

module.exports = router