const mongoose = require('mongoose');

const emotionTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  emotionScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0.5 // Neutral score
  },
  source: {
    type: String, 
    required: true,
    enum: ['note', 'chat', 'therapy']
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  emotion: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'excited', 'neutral']
  },
  notes: String // Additional context about why this score was assigned
});

emotionTrackingSchema.index({ userId: 1, timestamp: -1 });
emotionTrackingSchema.index({ sourceId: 1 }); 

const EmotionTracking = mongoose.model('EmotionTracking', emotionTrackingSchema);

module.exports = EmotionTracking;
