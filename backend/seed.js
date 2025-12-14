require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');
const User = require('./models/User');
const connectDB = require('./config/db');

const exercises = [
  {
    name: 'Push-ups',
    description: 'Bodyweight upper body exercise',
    category: 'strength',
    muscleGroup: 'Chest, Shoulders, Triceps',
    difficulty: 'beginner',
    instructions: 'Start in plank position, lower body until chest nearly touches floor, push back up',
  },
  {
    name: 'Squats',
    description: 'Bodyweight lower body exercise',
    category: 'strength',
    muscleGroup: 'Legs, Glutes',
    difficulty: 'beginner',
    instructions: 'Stand with feet shoulder-width apart, lower hips back and down, keep chest up',
  },
  {
    name: 'Running',
    description: 'Cardiovascular endurance exercise',
    category: 'cardio',
    muscleGroup: 'Full Body',
    difficulty: 'beginner',
    instructions: 'Run at a steady pace, maintain proper breathing',
  },
  {
    name: 'Bench Press',
    description: 'Upper body weightlifting exercise',
    category: 'strength',
    muscleGroup: 'Chest, Shoulders, Triceps',
    difficulty: 'intermediate',
    instructions: 'Lie on bench, grip bar, lower to chest, press upward',
  },
  {
    name: 'Deadlift',
    description: 'Full body weightlifting exercise',
    category: 'strength',
    muscleGroup: 'Back, Legs, Glutes',
    difficulty: 'advanced',
    instructions: 'Stand with feet hip-width apart, grip bar, lift from ground keeping back straight',
  },
  {
    name: 'Yoga',
    description: 'Flexibility and balance exercise',
    category: 'flexibility',
    muscleGroup: 'Full Body',
    difficulty: 'beginner',
    instructions: 'Follow yoga sequences focusing on breathing and flexibility',
  },
  {
    name: 'Swimming',
    description: 'Full body cardiovascular exercise',
    category: 'cardio',
    muscleGroup: 'Full Body',
    difficulty: 'intermediate',
    instructions: 'Swim laps at moderate intensity',
  },
  {
    name: 'Barbell Squat',
    description: 'Advanced lower body weightlifting',
    category: 'strength',
    muscleGroup: 'Legs, Glutes',
    difficulty: 'advanced',
    instructions: 'Barbell across shoulders, squat down maintaining posture, stand back up',
  },
  {
    name: 'Plank',
    description: 'Core strengthening exercise',
    category: 'strength',
    muscleGroup: 'Core',
    difficulty: 'beginner',
    instructions: 'Hold plank position, keep body straight, engage core',
  },
  {
    name: 'Cycling',
    description: 'Cardiovascular and leg endurance',
    category: 'cardio',
    muscleGroup: 'Legs',
    difficulty: 'intermediate',
    instructions: 'Maintain steady pace on bicycle',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Seed exercises
    await Exercise.deleteMany({});
    await Exercise.insertMany(exercises);
    console.log('Database seeded with exercise data');

    // Create admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const admin = new User({
          name: 'Administrator',
          email: adminEmail,
          password: adminPassword,
          age: 30,
          weight: 70,
          height: 175,
          goal: 'maintain fitness',
          isAdmin: true,
        });
        await admin.save();
        console.log('Admin user created');
      } else {
        console.log('Admin user already exists');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
