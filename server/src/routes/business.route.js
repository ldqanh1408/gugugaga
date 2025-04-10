const express = require("express");
const router = express.Router();

const { authenticateJWT, authenticateBusinessJWT } = require("../middleware");
const { addExpert } = require("../controllers/business.controller");

// router.get("/:businessId/treatment", business);
router.post("/:businessId/expert", authenticateBusinessJWT, addExpert)