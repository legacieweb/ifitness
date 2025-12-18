const express = require('express');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');
const { protect } = require('../controllers/authMiddleware');

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

    const bootcamp = new Bootcamp({
      title,
      description,
      exercises: exercises || [],
      expectations,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      difficulty: difficulty || 'Intermediate',
      maxParticipants,
      createdBy: req.user.id,
      participants: [],
    });

    await bootcamp.save();
    await bootcamp.populate('createdBy', 'name');

    res.status(201).json(bootcamp);
  } catch (err) {
    console.error('Error creating bootcamp:', err);
    res.status(500).json({ message: 'Error creating bootcamp' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    if (bootcamp.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
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

    if (bootcamp.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
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

    const alreadyAccepted = bootcamp.participants.find(
      (p) => p.userId.toString() === req.user.id
    );

    if (alreadyAccepted) {
      return res.status(400).json({ message: 'Already accepted this bootcamp' });
    }

    if (bootcamp.maxParticipants && bootcamp.participants.length >= bootcamp.maxParticipants) {
      return res.status(400).json({ message: 'Bootcamp is full' });
    }

    bootcamp.participants.push({
      userId: req.user.id,
      acceptedAt: new Date(),
      status: 'accepted',
    });

    await bootcamp.save();
    res.json({ message: 'Bootcamp accepted', bootcamp });
  } catch (err) {
    res.status(500).json({ message: 'Error accepting bootcamp' });
  }
});

router.post('/:id/decline', protect, async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }

    bootcamp.participants = bootcamp.participants.filter(
      (p) => p.userId.toString() !== req.user.id
    );

    await bootcamp.save();
    res.json({ message: 'Bootcamp declined' });
  } catch (err) {
    res.status(500).json({ message: 'Error declining bootcamp' });
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
