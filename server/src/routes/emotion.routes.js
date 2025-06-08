const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotion.controller');
const {authenticateAndAuthorize} = require('../middleware//authenticateJWT');

// All routes require authentication

// Track a new emotion data point
router.post('/track',authenticateAndAuthorize(["USER"]), emotionController.trackEmotion);

// Get emotion history with optional date range
router.get('/history',authenticateAndAuthorize(["USER"]), emotionController.getEmotionHistory);

// Get emotion statistics
router.get('/stats',authenticateAndAuthorize(["USER"]), emotionController.getEmotionStats);

module.exports = router;