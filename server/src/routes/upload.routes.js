const express = require("express");
const router = express.Router();
const upload = require("../controllers/upload.controller");
const jwt = require("../middleware/authenticateJWT");

// Business upload route
router.post("/v1/upload", 
  jwt.authenticateAndAuthorize(["BUSINESS"]), 
  upload.upload.single("image"), 
  upload.uploadImg
);

// Media upload route for notes (handles both image and audio)
router.post('/v1/media', 
  jwt.authenticateAndAuthorize(["USER"]), 
  upload.upload.single('file'), 
  upload.uploadAudioFile
);

module.exports = router;