const express = require("express");
const router = express.Router();
const { upload, uploadMedia } = require('../controllers/upload.controller');
const jwt = require("../middleware/authenticateJWT")

router.post("/v1/upload",jwt.authenticateAndAuthorize(["BUSINESS"]), upload.single("image"), upload.uploadImg);

router.post('/media', upload.single('file'), uploadMedia);

module.exports = router;