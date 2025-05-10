const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    emotionScore: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    emotion: {
        type: String,
        required: true,
        enum: ['happy', 'sad', 'angry', 'excited', 'neutral']
    },
    source: {
        type: String,
        required: true,
        enum: ['chat', 'note', 'therapy']
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    notes: String
}, {
    timestamps: true
});

// Index for faster queries
emotionSchema.index({ userId: 1, timestamp: -1 });
emotionSchema.index({ sourceId: 1 });

module.exports = mongoose.model('Emotion', emotionSchema);
