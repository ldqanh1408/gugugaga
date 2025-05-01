const express = require("express");
const router = express.Router();
const upload = require("../controllers/upload.controller")
const jwt = require("../middleware/authenticateJWT")
router.post("/v1/upload",jwt.authenticateAndAuthorize(["BUSINESS"]), upload.upload.single("image"), upload.uploadImg);
router.post('/media', upload.upload.single('file'), upload.uploadAudioFile); // hàm này làm dì á để upload image với audio trong note chat á t thấy m có hàm up audio á

module.exports = router;