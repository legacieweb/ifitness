const mongoose = require('mongoose');

const OutdoorActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  activityType: {
    type: String,
    required: true, // e.g., Hiking, Cycling, Running, etc.
  },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      duration: Number,
      notes: String,
    },
  ],
  expectations: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  maxParticipants: {
    type: Number,
  },
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      acceptedAt: Date,
      status: {
        type: String,
        enum: ['accepted', 'completed', 'missed'],
        default: 'accepted',
      },
    },
  ],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('OutdoorActivity', OutdoorActivitySchema);
