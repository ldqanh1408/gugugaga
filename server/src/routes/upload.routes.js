const express = require("express");
const router = express.Router();
const upload = require("../controllers/upload.controller")
const jwt = require("../middleware/authenticateJWT")
router.post("/v1/upload",jwt.authenticateAndAuthorize(["BUSINESS"]), upload.upload.single("image"), upload.uploadImg);

module.exports = router;