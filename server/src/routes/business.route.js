const express = require("express");
const router = express.Router();

const { authenticateJWT, authenticateBusinessJWT } = require("../middleware");


module.exports = router