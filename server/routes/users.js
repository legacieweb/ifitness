const express = require('express');
const User = require('../models/User');
const ProgressImage = require('../models/ProgressImage');
const { protect } = require('../controllers/authMiddleware');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to serve profile picture from MongoDB (Publicly accessible)
router.get('/profile/:id/picture', async (req, res) => {
  try {
    console.log(`[UsersAPI] Fetching profile picture for user: ${req.params.id}`);
    const user = await User.findById(req.params.id);
    
    if (!user || !user.profilePictureData || user.profilePictureData.length === 0) {
      console.log(`[UsersAPI] Profile picture not found or empty for user: ${req.params.id}`);
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    console.log(`[UsersAPI] Serving profile picture: ${user.profilePictureContentType} (${user.profilePictureData.length} bytes)`);
    res.set('Content-Type', user.profilePictureContentType);
    res.send(user.profilePictureData);
  } catch (error) {
    console.error(`[UsersAPI] Error serving profile picture:`, error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    
    res.json({
      ...userObj,
      profilePicture: (user.profilePictureData && user.profilePictureData.length > 0) ? `/api/users/profile/${req.params.id}/picture` : null,
      hasProfilePicture: !!(user.profilePictureData && user.profilePictureData.length > 0),
    });
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
        profilePicture: (user.profilePictureData && user.profilePictureData.length > 0) ? `/api/users/profile/${user._id}/picture` : null,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/profile/:id/upload', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    console.log(`[UsersAPI] Upload request for user: ${req.params.id}`);
    if (req.params.id !== req.user.id) {
      console.log(`[UsersAPI] Unauthorized upload attempt: ${req.user.id} tried to upload for ${req.params.id}`);
      return res.status(403).json({ message: 'Not authorized to upload for this profile' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      console.log(`[UsersAPI] No file found in request. Body keys:`, Object.keys(req.body));
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log(`[UsersAPI] Received file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Store image data in MongoDB
    user.profilePictureData = req.file.buffer;
    user.profilePictureContentType = req.file.mimetype;
    
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: `/api/users/profile/${req.params.id}/picture`, // URL to access the image from MongoDB
      hasImageData: true
    });
  } catch (error) {
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

router.get('/profile/:id/gallery', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this gallery' });
    }

    const images = await ProgressImage.find({ userId: req.params.id }).sort({ createdAt: -1 });
    const imageList = images.map(img => ({
      id: img._id,
      tag: img.tag,
      label: img.label,
      uploadedAt: img.createdAt,
      imageUrl: `/api/users/gallery/${img._id}`
    }));
    res.json(imageList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to serve gallery images from MongoDB
router.get('/gallery/:imageId', async (req, res) => {
  try {
    const image = await ProgressImage.findById(req.params.imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', image.contentType);
    res.send(image.imageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Weekly Routine Routes
router.get('/profile/:id/routine', protect, async (req, res) => {
  try {
    console.log(`[UsersAPI] Fetching routine for user ID: ${req.params.id}`);
    console.log(`[UsersAPI] Authenticated user ID: ${req.user.id}`);
    
    if (req.params.id !== req.user.id) {
      console.log(`[UsersAPI] Authorization failed: ID mismatch`);
      return res.status(403).json({ message: 'Not authorized to view this routine' });
    }

    const user = await User.findById(req.params.id).select('weeklyRoutine');
    if (!user) {
      console.log(`[UsersAPI] User not found: ${req.params.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`[UsersAPI] Found user with routine:`, JSON.stringify(user.weeklyRoutine));
    
    // Return the routine array directly
    res.json(user.weeklyRoutine);
  } catch (error) {
    console.error('[UsersAPI] Error fetching routine:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile/:id/routine/:dayIndex', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this routine' });
    }

    const { completed } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.weeklyRoutine[req.params.dayIndex]) {
      return res.status(400).json({ message: 'Invalid routine day index' });
    }

    user.weeklyRoutine[req.params.dayIndex].completed = completed;
    await user.save();

    res.json(user.weeklyRoutine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard Data Endpoint - All-in-one for dashboard
router.get('/dashboard/:id', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this dashboard' });
    }

    const Workout = require('../models/Workout');
    
    const [user, workouts] = await Promise.all([
      User.findById(req.params.id).select('-password'),
      Workout.find({ userId: req.params.id }).sort({ date: -1 }).limit(5)
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate stats
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const avgCalories = totalWorkouts > 0 ? totalCalories / totalWorkouts : 0;

    // Calculate streak (consecutive days with workouts)
    let streak = 0;
    if (workouts.length > 0) {
      const sortedWorkouts = [...workouts].sort((a, b) => b.date - a.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let lastWorkoutDate = new Date(sortedWorkouts[0].date);
      lastWorkoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak = 1;
        let checkDate = new Date(lastWorkoutDate);
        
        for (let i = 1; i < sortedWorkouts.length; i++) {
          const workoutDate = new Date(sortedWorkouts[i].date);
          workoutDate.setHours(0, 0, 0, 0);
          
          checkDate.setDate(checkDate.getDate() - 1);
          if (workoutDate.getTime() === checkDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate weekly progress (last 7 days)
    const weeklyProgress = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= date && workoutDate < nextDate;
      });
      
      const dayCalories = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      
      weeklyProgress.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString(),
        calories: dayCalories,
        workouts: dayWorkouts.length
      });
    }

    // Calculate achievements based on stats
    const achievements = [];
    
    if (totalWorkouts >= 1) {
      achievements.push({ type: 'first', name: 'First Step', description: 'Completed your first workout', icon: 'bi-star-fill', earnedAt: workouts[workouts.length - 1]?.createdAt });
    }
    if (totalWorkouts >= 5) {
      achievements.push({ type: 'dedication', name: 'Getting Serious', description: 'Completed 5 workouts', icon: 'bi-heart-fill', earnedAt: new Date() });
    }
    if (totalWorkouts >= 10) {
      achievements.push({ type: 'consistent', name: 'Workout Warrior', description: 'Completed 10 workouts', icon: 'bi-lightning-fill', earnedAt: new Date() });
    }
    if (streak >= 3) {
      achievements.push({ type: 'streak', name: 'On Fire', description: `${streak} day workout streak`, icon: 'bi-fire', earnedAt: new Date() });
    }
    if (totalCalories >= 500) {
      achievements.push({ type: 'calories', name: 'Calorie Crusher', description: 'Burned 500 calories', icon: 'bi-cup-hot-fill', earnedAt: new Date() });
    }
    if (totalDuration >= 60) {
      achievements.push({ type: 'time', name: 'Time Invested', description: '60+ minutes of workout', icon: 'bi-clock-fill', earnedAt: new Date() });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        profilePicture: (user.profilePictureData && user.profilePictureData.length > 0) ? `/api/users/profile/${user._id}/picture` : null,
        weeklyRoutine: user.weeklyRoutine,
        goals: user.goals || [],
        achievements: user.achievements || achievements
      },
      stats: {
        totalWorkouts,
        totalCalories: Math.round(totalCalories),
        totalDuration,
        averageCaloriesPerWorkout: Math.round(avgCalories),
        streak
      },
      recentWorkouts: workouts.map(w => ({
        id: w._id,
        name: w.name,
        date: w.date,
        duration: w.duration,
        caloriesBurned: w.caloriesBurned,
        exercisesCount: w.exercises?.length || 0
      })),
      weeklyProgress,
      achievements
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Goals Routes
router.get('/goals/:id', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these goals' });
    }

    const user = await User.findById(req.params.id).select('goals');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.goals || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/goals/:id', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add goals' });
    }

    const { title, target, current, unit, deadline } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.goals = user.goals || [];
    user.goals.push({
      title,
      target,
      current: current || 0,
      unit: unit || 'times',
      deadline,
      completed: false
    });

    await user.save();
    res.json(user.goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/goals/:userId/:goalId', protect, async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update goals' });
    }

    const { current, completed } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const goal = user.goals?.find(g => g._id.toString() === req.params.goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (current !== undefined) goal.current = current;
    if (completed !== undefined) goal.completed = completed;

    await user.save();
    res.json(user.goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/goals/:userId/:goalId', protect, async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete goals' });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.goals = user.goals?.filter(g => g._id.toString() !== req.params.goalId) || [];
    await user.save();
    res.json(user.goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
