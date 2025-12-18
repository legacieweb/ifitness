const express = require('express');
const Exercise = require('../models/Exercise');
const { protect } = require('../controllers/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, difficulty, muscleGroup } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (muscleGroup) filter.muscleGroup = muscleGroup;

    const exercises = await Exercise.find(filter);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, category, muscleGroup, difficulty, instructions } = req.body;

    const exercise = new Exercise({
      name,
      description,
      category,
      muscleGroup,
      difficulty,
      instructions,
    });

    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/suggestions/:goal', async (req, res) => {
  try {
    const { goal } = req.params;
    let filter = {};

    switch (goal) {
      case 'weight loss':
        filter = { category: { $in: ['cardio', 'strength'] } };
        break;
      case 'muscle gain':
        filter = { category: 'strength', difficulty: { $in: ['intermediate', 'advanced'] } };
        break;
      case 'maintain fitness':
        filter = {};
        break;
      case 'improve endurance':
        filter = { category: { $in: ['cardio', 'flexibility'] } };
        break;
      default:
        filter = {};
    }

    const suggestions = await Exercise.find(filter).limit(5);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
