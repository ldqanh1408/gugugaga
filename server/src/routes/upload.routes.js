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

// Audio upload route
router.post('/v1/media/audio', 
  jwt.authenticateAndAuthorize(["USER"]), 
  upload.uploadAudio.single('file'), 
  upload.uploadAudioFile
);

// Media upload route for notes (handles both image and audio)
router.post('/v1/media/img', 
  jwt.authenticateAndAuthorize(["USER"]), 
  upload.upload.single('file'), 
  upload.uploadImageFile
);
module.exports = router;