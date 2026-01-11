const express = require('express');
const User = require('../models/User');
const Workout = require('../models/Workout');
const ProgressImage = require('../models/ProgressImage');
const { sendSuspensionEmail, sendUnsuspensionEmail, sendWorkoutReminderEmail } = require('../services/mailService');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const userStats = await Promise.all(
      users.map(async (user) => {
        const workoutCount = await Workout.countDocuments({ userId: user._id });
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          weight: user.weight,
          height: user.height,
          goal: user.goal,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          workoutCount,
          suspended: user.suspended,
          suspendedReason: user.suspendedReason,
          suspendedAt: user.suspendedAt,
          profilePicture: user.profilePictureData ? `/api/users/profile/${user._id}/picture` : null,
        };
      })
    );
    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Progress Gallery Routes (Moved up to prevent conflicts)
router.get('/users/:id/gallery', adminAuth, async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }
    
    console.log(`[AdminAPI] Fetching gallery for user: ${req.params.id}`);
    const images = await ProgressImage.find({ userId: req.params.id }).sort({ createdAt: -1 });
    console.log(`[AdminAPI] Found ${images.length} images for user: ${req.params.id}`);
    const imageList = images.map(img => ({
      id: img._id,
      tag: img.tag,
      label: img.label,
      uploadedAt: img.createdAt,
      imageUrl: `/api/users/gallery/${img._id}`
    }));
    res.json(imageList);
  } catch (error) {
    console.error(`[AdminAPI] Gallery fetch error for user ${req.params.id}:`, error);
    next(error);
  }
});

router.post('/users/:id/gallery', adminAuth, upload.single('image'), async (req, res) => {
  try {
    console.log(`[AdminAPI] Adding image to gallery for user: ${req.params.id}`);
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { tag, label } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const progressImage = new ProgressImage({
      userId: req.params.id,
      imageData: req.file.buffer,
      contentType: req.file.mimetype,
      tag: tag || 'Progress',
      label: label || '',
      uploadedBy: decoded.id
    });

    await progressImage.save();
    console.log(`[AdminAPI] Image saved successfully for user: ${req.params.id}`);

    res.status(201).json({
      message: 'Image added to gallery successfully',
      image: {
        id: progressImage._id,
        tag: progressImage.tag,
        label: progressImage.label,
        uploadedAt: progressImage.createdAt,
        imageUrl: `/api/users/gallery/${progressImage._id}`
      }
    });
  } catch (error) {
    console.error(`[AdminAPI] Gallery upload error:`, error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/gallery/:imageId', adminAuth, async (req, res) => {
  try {
    const image = await ProgressImage.findByIdAndDelete(req.params.imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted from gallery' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const workouts = await Workout.find({ userId: user._id });
    const stats = {
      totalWorkouts: workouts.length,
      totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    };

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        suspended: user.suspended,
        suspendedReason: user.suspendedReason,
        suspendedAt: user.suspendedAt,
        weeklyRoutine: user.weeklyRoutine,
        profilePicture: user.profilePictureData ? `/api/users/profile/${user._id}/picture` : null,
      },
      stats,
      recentWorkouts: workouts.slice(-5).reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await Workout.deleteMany({ userId: req.params.id });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    const suspendedUsers = await User.countDocuments({ suspended: true });
    const totalCalories = await Workout.aggregate([
      { $group: { _id: null, total: { $sum: '$caloriesBurned' } } }
    ]);
    const totalDuration = await Workout.aggregate([
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    res.json({
      totalUsers,
      totalWorkouts,
      suspendedUsers,
      totalCalories: totalCalories[0]?.total || 0,
      totalDuration: totalDuration[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get weekly activity data for charts
router.get('/weekly-activity', adminAuth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const now = new Date();
    let startDate;

    if (period === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    // Get user registrations by day
    const userRegistrations = await User.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get workouts completed by day
    const workoutCompletions = await Workout.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      userRegistrations,
      workoutCompletions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get workout distribution by type
router.get('/workout-distribution', adminAuth, async (req, res) => {
  try {
    const distribution = await Workout.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const total = distribution.reduce((sum, item) => sum + item.count, 0);
    const result = distribution.map(item => ({
      name: item._id || 'Other',
      value: Math.round((item.count / total) * 100),
      count: item.count
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get system health metrics
router.get('/system-health', adminAuth, async (req, res) => {
  try {
    // In a real app, you would get these from system monitoring
    // For now, we return simulated data
    const health = {
      cpu: Math.floor(Math.random() * 60) + 20,
      memory: Math.floor(Math.random() * 40) + 40,
      storage: Math.floor(Math.random() * 30) + 50,
      apiLatency: Math.floor(Math.random() * 100) + 50,
      uptime: 99.9 + (Math.random() * 0.09),
      activeConnections: Math.floor(Math.random() * 100) + 50,
      databaseConnections: Math.floor(Math.random() * 20) + 5,
      lastBackup: new Date(Date.now() - Math.random() * 86400000).toISOString()
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        suspended: true,
        suspendedReason: reason || 'Account suspended by administrator',
        suspendedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    sendSuspensionEmail(user.email, user.name, reason || 'Account suspended by administrator');

    res.json({
      message: 'User suspended successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        suspended: user.suspended,
        suspendedReason: user.suspendedReason,
        suspendedAt: user.suspendedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id/unsuspend', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        suspended: false,
        suspendedReason: null,
        suspendedAt: null
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    sendUnsuspensionEmail(user.email, user.name);

    res.json({
      message: 'User unsuspended successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        suspended: user.suspended,
        suspendedReason: user.suspendedReason,
        suspendedAt: user.suspendedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Weekly Routine Routes
router.put('/users/:id/routine', adminAuth, async (req, res) => {
  try {
    const { routine } = req.body;
    console.log(`[AdminAPI] Saving routine for user ${req.params.id}:`, JSON.stringify(routine));
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { weeklyRoutine: routine },
      { new: true }
    ).select('-password');

    console.log(`[AdminAPI] Routine saved. User now has ${user.weeklyRoutine?.length || 0} routine days`);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Weekly routine updated successfully',
      routine: user.weeklyRoutine
    });
  } catch (error) {
    console.error('[AdminAPI] Error saving routine:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/users/:id/send-reminder', adminAuth, async (req, res) => {
  try {
    const { dayIndex } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const routineItem = user.weeklyRoutine[dayIndex];
    if (!routineItem) {
      return res.status(400).json({ message: 'Invalid routine day' });
    }

    await sendWorkoutReminderEmail(user.email, user.name, routineItem);

    res.json({ message: 'Reminder email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
