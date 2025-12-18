const express = require('express');
const Workout = require('../models/Workout');
const { protect } = require('../controllers/authMiddleware');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, duration, exercises, caloriesBurned, notes } = req.body;

    const workout = new Workout({
      userId: req.user.id,
      name,
      description,
      duration,
      exercises,
      caloriesBurned,
      notes,
    });

    await workout.save();
    await workout.populate('exercises.exerciseId');

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id })
      .populate('exercises.exerciseId')
      .sort({ date: -1 });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('exercises.exerciseId');

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this workout' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this workout' });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('exercises.exerciseId');

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this workout' });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
