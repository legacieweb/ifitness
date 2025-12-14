const express = require('express');
const User = require('../models/User');
const Workout = require('../models/Workout');
const { sendSuspensionEmail, sendUnsuspensionEmail } = require('../services/mailService');
const router = express.Router();

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
          workoutCount,
          suspended: user.suspended,
          suspendedReason: user.suspendedReason,
          suspendedAt: user.suspendedAt,
        };
      })
    );
    res.json(userStats);
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
        suspended: user.suspended,
        suspendedReason: user.suspendedReason,
        suspendedAt: user.suspendedAt,
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

module.exports = router;
