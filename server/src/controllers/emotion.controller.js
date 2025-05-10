const EmotionTracking = require("../models/emotionTracking.model");

// Track a new emotion
exports.trackEmotion = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { emotion, emotionScore, source, sourceId, notes } = req.body;

    // Check if there's an existing record for this source
    const existingTrack = await EmotionTracking.findOne({
      userId,
      source,
      sourceId,
    });

    if (existingTrack) {
      // Update the existing record
      existingTrack.emotion = emotion;
      existingTrack.emotionScore = emotionScore;
      existingTrack.notes = notes;
      await existingTrack.save();

      return res.status(200).json({
        message: "Emotion updated successfully",
        data: existingTrack,
      });
    }

    // Create a new record if none exists
    const emotionTrack = new EmotionTracking({
      userId,
      emotionScore,
      emotion,
      source,
      sourceId,
      notes,
    });
    await emotionTrack.save();

    res.status(201).json({
      message: "Emotion tracked successfully",
      data: emotionTrack,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error tracking emotion",
      error: error.message,
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
      data: emotions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving emotion history",
      error: error.message,
    });
  }
};

exports.getEmotionStats = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { timeRange } = req.query;
    console.log(timeRange);
    const startDate = new Date();
    switch (timeRange) {
      case "day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }
    let records
    if (timeRange === "allTime") {
      records = await EmotionTracking.find({
        userId,
      }).sort({ timestamp: 1 });
      
    }
    else{
      records = await EmotionTracking.find({
        userId,
        timestamp: { $gte: startDate.toISOString() },
      }).sort({ timestamp: 1 });

    }
    // Gom dữ liệu theo ngày
    const dailyStats = {};

    for (const record of records) {
      const dateStr = record.timestamp.toISOString().split("T")[0]; // YYYY-MM-DD
      const score = parseFloat(record.emotionScore) || 0;

      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          totalScore: 0,
          count: 0,
        };
      }

      dailyStats[dateStr].totalScore += score;
      dailyStats[dateStr].count += 1;
    }

    // Format dữ liệu cho biểu đồ
    const result = Object.entries(dailyStats).map(
      ([date, { totalScore, count }]) => ({
        date,
        value: Number((totalScore / count).toFixed(2)), // lấy trung bình
      })
    );
    res.json({
      message: "Emotion stats retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error getting emotion stats:", error);
    res.status(500).json({
      message: "Error retrieving emotion stats",
      error: error.message,
    });
  }
};
