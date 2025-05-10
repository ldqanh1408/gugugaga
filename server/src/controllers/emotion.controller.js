const EmotionTracking = require('../models/emotionTracking.model');

// Track a new emotion
exports.trackEmotion = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { emotion, emotionScore, source, sourceId, notes } = req.body;

    // Check if there's an existing record for this source
    const existingTrack = await EmotionTracking.findOne({ userId, source, sourceId });

    if (existingTrack) {
      // Update the existing record
      existingTrack.emotion = emotion;
      existingTrack.emotionScore = emotionScore;
      existingTrack.notes = notes;
      await existingTrack.save();

      return res.status(200).json({
        message: "Emotion updated successfully",
        data: existingTrack
      });
    }

    // Create a new record if none exists
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
    const userId = req.payload._id;
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

// Get emotion statistics
exports.getEmotionStats = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { timeRange } = req.query;

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
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Get emotion records from EmotionTracking collection
    const records = await EmotionTracking.find({
      userId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    // Calculate statistics for each emotion
    const statsMap = {};
    for (const record of records) {
      const emotion = record.emotion;
      const score = parseFloat(record.emotionScore) || 0;

      if (!statsMap[emotion]) {
        statsMap[emotion] = {
          count: 0,
          totalScore: 0,
          data: []
        };
      }

      statsMap[emotion].count += 1;
      statsMap[emotion].totalScore += score;
      statsMap[emotion].data.push({
        timestamp: record.timestamp,
        score: score,
        source: record.source,
        notes: record.notes
      });
    }

    // Format statistics for response
    const stats = Object.entries(statsMap).map(([emotion, { count, totalScore, data }]) => ({
      emotion,
      count,
      avgScore: Number((totalScore / count).toFixed(2)),
      trend: data.sort((a, b) => a.timestamp - b.timestamp)
    }));

    console.log('Emotion stats calculated:', stats);

    res.json({
      message: "Emotion stats retrieved successfully",
      data: stats
    });

  } catch (error) {
    console.error('Error getting emotion stats:', error);
    res.status(500).json({
      message: "Error retrieving emotion stats",
      error: error.message
    });
  }
};