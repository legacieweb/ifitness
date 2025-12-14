const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');
const Workout = require('../models/Workout');
const { protect } = require('../controllers/authMiddleware');
const { sendBootcampInvitationEmail } = require('../services/mailService');

const getValidUserId = async (userIdFromToken) => {
  if (mongoose.Types.ObjectId.isValid(userIdFromToken)) {
    return userIdFromToken;
  }
  const user = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!user) throw new Error('User not found');
  return user._id;
};

router.get('/', async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find()
      .populate('createdBy', 'name')
      .sort({ startTime: 1 });
    res.json(bootcamps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bootcamps' });
  }
});

router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const bootcamp = await Bootcamp.findOne({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: { $in: ['active', 'upcoming'] },
    })
      .populate('createdBy', 'name')
      .sort({ startTime: -1 });
    res.json(bootcamp || {});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching active bootcamp' });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const bootcamp = await Bootcamp.findOne({
      startTime: { $gt: now },
      status: 'upcoming',
    })
      .populate('createdBy', 'name')
      .sort({ startTime: 1 });
    res.json(bootcamp || {});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching upcoming bootcamp' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { title, description, exercises, expectations, startTime, endTime, difficulty, maxParticipants } = req.body;

    if (!title || !description || !expectations || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validUserId = await getValidUserId(req.user.id);

    const bootcamp = new Bootcamp({
      title,
      description,
      exercises: exercises || [],
      expectations,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      difficulty: difficulty || 'Intermediate',
      maxParticipants,
      createdBy: validUserId,
      participants: [],
    });

    await bootcamp.save();
    await bootcamp.populate('createdBy', 'name');

    res.status(201).json(bootcamp);
  } catch (err) {
    console.error('Error creating bootcamp:', err);
    res.status(500).json({ message: 'Error creating bootcamp', error: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    const validUserId = await getValidUserId(req.user.id);

    if (bootcamp.createdBy.toString() !== validUserId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const now = new Date();
    if (bootcamp.startTime <= now) {
      return res.status(400).json({ message: 'Cannot edit bootcamp that has started' });
    }

    const { title, description, exercises, expectations, startTime, endTime, difficulty, maxParticipants, status } = req.body;

    if (title) bootcamp.title = title;
    if (description) bootcamp.description = description;
    if (exercises) bootcamp.exercises = exercises;
    if (expectations) bootcamp.expectations = expectations;
    if (startTime) bootcamp.startTime = new Date(startTime);
    if (endTime) bootcamp.endTime = new Date(endTime);
    if (difficulty) bootcamp.difficulty = difficulty;
    if (maxParticipants) bootcamp.maxParticipants = maxParticipants;
    if (status) bootcamp.status = status;

    await bootcamp.save();
    await bootcamp.populate('createdBy', 'name');

    res.json(bootcamp);
  } catch (err) {
    res.status(500).json({ message: 'Error updating bootcamp' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    const validUserId = await getValidUserId(req.user.id);

    if (bootcamp.createdBy.toString() !== validUserId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const now = new Date();
    if (bootcamp.startTime <= now) {
      return res.status(400).json({ message: 'Cannot delete bootcamp that has started' });
    }

    await Bootcamp.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bootcamp deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting bootcamp' });
  }
});

router.post('/:id/accept', protect, async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    let validUserId;
    try {
      validUserId = await getValidUserId(req.user.id);
    } catch (userErr) {
      return res.status(400).json({ message: 'User not found: ' + userErr.message });
    }

    const alreadyAccepted = bootcamp.participants.find(
      (p) => p.userId.toString() === validUserId.toString()
    );

    if (alreadyAccepted) {
      return res.status(400).json({ message: 'Already accepted this bootcamp' });
    }

    if (bootcamp.maxParticipants && bootcamp.participants.length >= bootcamp.maxParticipants) {
      return res.status(400).json({ message: 'Bootcamp is full' });
    }

    bootcamp.participants.push({
      userId: validUserId,
      acceptedAt: new Date(),
      status: 'accepted',
    });

    await bootcamp.save();

    const user = await User.findById(validUserId);
    const workoutName = `🏆 ${bootcamp.title} - Bootcamp Achievement`;
    const workoutDescription = `You successfully accepted and participated in the ${bootcamp.title} bootcamp!`;

    const achievement = new Workout({
      userId: validUserId,
      name: workoutName,
      description: workoutDescription,
      date: new Date(),
      notes: `Bootcamp: ${bootcamp.title}\nExpectations: ${bootcamp.expectations}`,
      createdAt: new Date(),
    });

    await achievement.save();

    res.json({ 
      message: 'Bootcamp accepted! Achievement added to your workouts!', 
      bootcamp,
      achievement 
    });
  } catch (err) {
    console.error('Error accepting bootcamp:', err.message, err.stack);
    res.status(500).json({ message: 'Error accepting bootcamp: ' + (err.message || JSON.stringify(err)) });
  }
});

router.post('/:id/decline', protect, async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    let validUserId;
    try {
      validUserId = await getValidUserId(req.user.id);
    } catch (userErr) {
      return res.status(400).json({ message: 'User not found: ' + userErr.message });
    }

    bootcamp.participants = bootcamp.participants.filter(
      (p) => p.userId.toString() !== validUserId.toString()
    );

    await bootcamp.save();
    res.json({ message: 'Bootcamp declined' });
  } catch (err) {
    console.error('Error declining bootcamp:', err);
    res.status(500).json({ message: 'Error declining bootcamp: ' + err.message });
  }
});

router.post('/:id/invite', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'userIds array is required' });
    }

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    const users = await User.find({ _id: { $in: userIds } });
    if (users.length === 0) {
      return res.status(404).json({ message: 'No valid users found' });
    }

    const bootcampDetails = {
      description: bootcamp.description,
      difficulty: bootcamp.difficulty,
      startTime: bootcamp.startTime,
      endTime: bootcamp.endTime,
      expectations: bootcamp.expectations,
    };

    for (const user of users) {
      sendBootcampInvitationEmail(user.email, user.name, bootcamp.title, bootcampDetails);
    }

    res.json({
      message: `Bootcamp invitation emails sent to ${users.length} user(s)`,
      sentCount: users.length,
    });
  } catch (err) {
    console.error('Error sending bootcamp invitations:', err);
    res.status(500).json({ message: 'Error sending bootcamp invitations: ' + err.message });
  }
});

router.get('/status/:id', async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    const now = new Date();
    const timeUntilStart = bootcamp.startTime - now;
    const timeUntilEnd = bootcamp.endTime - now;
    const isActive = bootcamp.startTime <= now && bootcamp.endTime >= now;
    const hasStarted = bootcamp.startTime <= now;
    const hasEnded = bootcamp.endTime < now;

    res.json({
      id: bootcamp._id,
      title: bootcamp.title,
      isActive,
      hasStarted,
      hasEnded,
      timeUntilStart: Math.max(0, timeUntilStart),
      timeUntilEnd: Math.max(0, timeUntilEnd),
      startTime: bootcamp.startTime,
      endTime: bootcamp.endTime,
      participantCount: bootcamp.participants.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bootcamp status' });
  }
});

module.exports = router;
