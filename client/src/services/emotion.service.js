import axios from "axios";
import { getToken } from "./authService";

// Analyze text content for emotions
const analyzeEmotion = (text) => {
  const emotions = {
    happy: [
      "happy",
      "glad",
      "great",
      "wonderful",
      "excited",
      "love",
      ":)",
      "❤️",
      "😊",
      "😃",
      "hạnh phúc",
      "vui",
      "thích",
      "yêu",
    ],
    sad: [
      "sad",
      "unhappy",
      "disappointed",
      "miss",
      "hurt",
      ":(",
      "😢",
      "😭",
      "💔",
      "buồn",
      "nhớ",
      "khổ",
      "đau",
    ],
    angry: [
      "angry",
      "mad",
      "hate",
      "frustrated",
      "annoyed",
      "😠",
      "😡",
      "giận",
      "tức",
      "ghét",
      "khó chịu",
    ],
    excited: [
      "amazing",
      "awesome",
      "fantastic",
      "super",
      "incredible",
      "🎉",
      "✨",
      "tuyệt vời",
      "tốt quá",
      "xuất sắc",
    ],
    neutral: [
      "ok",
      "fine",
      "normal",
      "alright",
      "hmm",
      "🤔",
      "bình thường",
      "ổn",
      "được",
    ],
  };

  text = text.toLowerCase();

  // Count emotion keywords
  const scores = {};
  for (const [emotion, keywords] of Object.entries(emotions)) {
    scores[emotion] = keywords.reduce(
      (count, keyword) => count + (text.includes(keyword) ? 1 : 0),
      0
    );
  }

  // Find dominant emotion
  let maxScore = 0;
  let dominantEmotion = "neutral";
  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  }

  // Base emotion scores
  const emotionScores = {
    happy: 0.75,
    excited: 0.9,
    neutral: 0.5,
    sad: 0.25,
    angry: 0.1,
  };

  // Add natural variation to the score
  const baseScore = emotionScores[dominantEmotion];
  const variation = (Math.random() - 0.5) * 0.2; // ±0.1 variation
  const finalScore = Math.max(0, Math.min(1, baseScore + variation));

  return {
    emotion: dominantEmotion,
    emotionScore: finalScore,
  };
};

// Đổi URL API cho đúng backend
const API_BASE = "http://localhost:5000/api"; // bỏ /v1, đúng với backend

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Track user emotion from text input
export const trackUserEmotion = async (
  text,
  source,
  sourceId,
  aiEmotion = null,
  aiEmotionScore = null
) => {
  try {
    const token = await getToken();
    console.log("Token sent in Authorization header:", token);
    // If AI emotion data is provided, use it; otherwise analyze the text
    const emotionData =
      aiEmotion && aiEmotionScore
        ? { emotion: aiEmotion, emotionScore: aiEmotionScore }
        : analyzeEmotion(text);
    const response = await api.post(
      `/emotions/track`,
      {
        emotion: emotionData.emotion,
        emotionScore: emotionData.emotionScore,
        source,
        sourceId,
        notes: text.substring(0, 100), // First 100 chars as context
        isAIResponse: !!aiEmotion, // Flag to indicate if this is an AI response
      },
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return response.data;
  } catch (error) {
    console.error("Error tracking emotion:", error);
    throw error;
  }
};

// Get emotion history
export const getEmotionHistory = async (timeRange) => {
  try {
    const token = await getToken();
    const response = await api.get(
      `/emotions/history?timeRange=${timeRange}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get emotion statistics
export const getEmotionStats = async (timeRange) => {
  try {
    const token = await getToken();
    console.log('Fetching emotion stats for timeRange:', timeRange);

    const response = await api.get(
      `/emotions/stats?timeRange=${timeRange}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );

    console.log('Emotion stats response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching emotion stats:', error);
    throw error.response?.data || error;
  }
};
