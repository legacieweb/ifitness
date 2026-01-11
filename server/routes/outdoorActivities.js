const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OutdoorActivity = require('../models/OutdoorActivity');
const User = require('../models/User');
const Workout = require('../models/Workout');
const { protect } = require('../controllers/authMiddleware');
const { sendOutdoorActivityInvitationEmail, sendOutdoorActivityAcceptanceEmail } = require('../services/mailService');

const getValidUserId = async (userIdFromToken) => {
  if (mongoose.Types.ObjectId.isValid(userIdFromToken)) {
    return userIdFromToken;
  }
  const user = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!user) throw new Error('User not found');
  return user._id;
};

// Get all outdoor activities
router.get('/', async (req, res) => {
  try {
    const activities = await OutdoorActivity.find()
      .populate('createdBy', 'name')
      .sort({ startTime: 1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Get active activities
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const activity = await OutdoorActivity.findOne({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: { $in: ['active', 'upcoming'] },
    })
      .populate('createdBy', 'name')
      .sort({ startTime: -1 });
    res.json(activity || {});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching active activity' });
  }
});

// Create outdoor activity
router.post('/', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { title, description, location, activityType, exercises, expectations, startTime, endTime, difficulty, maxParticipants } = req.body;

    if (!title || !description || !location || !activityType || !expectations || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validUserId = await getValidUserId(req.user.id);

    const activity = new OutdoorActivity({
      title,
      description,
      location,
      activityType,
      exercises: exercises || [],
      expectations,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      difficulty: difficulty || 'Intermediate',
      maxParticipants,
      createdBy: validUserId,
      participants: [],
    });

    await activity.save();
    await activity.populate('createdBy', 'name');

    res.status(201).json(activity);
  } catch (err) {
    console.error('Error creating outdoor activity:', err);
    res.status(500).json({ message: 'Error creating activity', error: err.message });
  }
});

// Update outdoor activity
router.put('/:id', protect, async (req, res) => {
  try {
    const activity = await OutdoorActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const validUserId = await getValidUserId(req.user.id);

    if (activity.createdBy.toString() !== validUserId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, location, activityType, exercises, expectations, startTime, endTime, difficulty, maxParticipants, status } = req.body;

    if (title) activity.title = title;
    if (description) activity.description = description;
    if (location) activity.location = location;
    if (activityType) activity.activityType = activityType;
    if (exercises) activity.exercises = exercises;
    if (expectations) activity.expectations = expectations;
    if (startTime) activity.startTime = new Date(startTime);
    if (endTime) activity.endTime = new Date(endTime);
    if (difficulty) activity.difficulty = difficulty;
    if (maxParticipants) activity.maxParticipants = maxParticipants;
    if (status) activity.status = status;

    await activity.save();
    await activity.populate('createdBy', 'name');

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Error updating activity' });
  }
});

// Delete outdoor activity
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await OutdoorActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const validUserId = await getValidUserId(req.user.id);

    if (activity.createdBy.toString() !== validUserId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await OutdoorActivity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting activity' });
  }
});

// Accept invite
router.post('/:id/accept', protect, async (req, res) => {
  try {
    const activity = await OutdoorActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const validUserId = await getValidUserId(req.user.id);

    const alreadyAccepted = activity.participants.find(
      (p) => p.userId.toString() === validUserId.toString()
    );

    if (alreadyAccepted) {
      return res.status(400).json({ message: 'Already joined this activity' });
    }

    if (activity.maxParticipants && activity.participants.length >= activity.maxParticipants) {
      return res.status(400).json({ message: 'Activity is full' });
    }

    activity.participants.push({
      userId: validUserId,
      acceptedAt: new Date(),
      status: 'accepted',
    });

    await activity.save();

    const user = await User.findById(validUserId);
    
    // Add achievement
    const achievement = new Workout({
      userId: validUserId,
      name: `🌲 ${activity.title} - Outdoor Achievement`,
      description: `Joined the ${activity.title} outdoor activity!`,
      date: new Date(),
      notes: `Location: ${activity.location}\nType: ${activity.activityType}`,
      createdAt: new Date(),
    });
    await achievement.save();

    sendOutdoorActivityAcceptanceEmail(user.email, user.name, activity.title).catch(console.error);

    res.json({ message: 'Activity joined!', activity });
  } catch (err) {
    res.status(500).json({ message: 'Error joining activity: ' + err.message });
  }
});

// Invite all users
router.post('/:id/invite-all', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const activity = await OutdoorActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const users = await User.find({ isSuspended: { $ne: true } });
    
    const activityDetails = {
      description: activity.description,
      difficulty: activity.difficulty,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      activityType: activity.activityType
    };

    for (const user of users) {
      sendOutdoorActivityInvitationEmail(user.email, user.name, activity.title, activityDetails).catch(console.error);
    }

    res.json({ message: `Invitations sent to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ message: 'Error sending invitations: ' + err.message });
  }
});

module.exports = router;
