require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bootcamps', require('./routes/bootcamps'));
app.use('/api/outdoor-activities', require('./routes/outdoorActivities'));

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Fitness API' });
});

const buildPath = path.join(__dirname, '../client/build');
const fs = require('fs');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  // Global error handler for API routes
  app.use('/api', (err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
  
  // Only serve React app for non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      // If it's an API route that wasn't matched, return 404 JSON
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    // For non-API routes, serve the React app
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ message: 'Frontend not built. Run: cd server && npm run build-and-start' });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
