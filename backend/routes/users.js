const express = require('express');
const User = require('../models/User');
const { protect } = require('../controllers/authMiddleware');
const router = express.Router();

router.get('/profile/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile/:id', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { name, age, weight, height, goal } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (age) user.age = age;
    if (weight) user.weight = weight;
    if (height) user.height = height;
    if (goal) user.goal = goal;

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/:id', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these stats' });
    }

    const Workout = require('../models/Workout');
    const workouts = await Workout.find({ userId: req.params.id });

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    const avgCalories = totalWorkouts > 0 ? totalCalories / totalWorkouts : 0;
    
    res.json({
      totalWorkouts,
      totalCalories: Math.round(totalCalories),
      totalDuration,
      averageCaloriesPerWorkout: Math.round(avgCalories),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
