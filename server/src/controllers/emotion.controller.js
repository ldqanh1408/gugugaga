const EmotionTracking = require('../models/emotionTracking.model');

// Map text emotions to numerical scores between 0 and 1
const emotionScores = {
  'angry': 0.1,
  'sad': 0.25,
  'neutral': 0.5,
  'happy': 0.75,
  'excited': 0.9
};

// Track emotion from any source (note/chat/therapy)
exports.trackEmotion = async (req, res) => {
  try {
    const { emotion, source, sourceId, notes } = req.body;
    const userId = req.user._id;

    const emotionScore = emotionScores[emotion] || 0.5;

    const emotionTrack = new EmotionTracking({
      userId,
      emotionScore,
      emotion,
      source,
      sourceId,
      notes
    });

    await emotionTrack.save();

    res.status(201).json({
      message: "Emotion tracked successfully",
      data: emotionTrack
    });

  } catch (error) {
    res.status(500).json({
      message: "Error tracking emotion",
      error: error.message
    });
  }
};

// Get emotion history for a user
exports.getEmotionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const query = { userId };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const emotions = await EmotionTracking.find(query)
      .sort({ timestamp: -1 })
      .limit(1000); // Reasonable limit for data points

    res.json({
      message: "Emotion history retrieved successfully",
      data: emotions
    });

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving emotion history",
      error: error.message
    });
  }
};

// Get emotion stats
exports.getEmotionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeRange } = req.query; // 'day', 'week', 'month', 'year'
    
    const startDate = new Date();
    switch (timeRange) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;  
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1); // Default to 1 month
    }

    const stats = await EmotionTracking.aggregate([
      {
        $match: {
          userId: userId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$emotion",
          count: { $sum: 1 },
          avgScore: { $avg: "$emotionScore" }
        }
      }
    ]);

    res.json({
      message: "Emotion stats retrieved successfully", 
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving emotion stats",
      error: error.message  
    });
  }
};
