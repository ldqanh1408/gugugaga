const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotion.controller');
const { authToken } = require('../middleware/auth');

// All routes require authentication
router.use(authToken);

// Track a new emotion data point
router.post('/track', emotionController.trackEmotion);

// Get emotion history with optional date range
router.get('/history', emotionController.getEmotionHistory);

// Get emotion statistics
router.get('/stats', emotionController.getEmotionStats);

module.exports = router;
