const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../controllers/authMiddleware');
const { sendSignUpEmail, sendSuspensionEmail, sendUnsuspensionEmail } = require('../services/mailService');
const router = express.Router();

const generateToken = (id, isAdmin = false) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, weight, height, goal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      age,
      weight,
      height,
      goal,
    });

    await user.save();

const token = generateToken(user._id);

    // Send welcome email (non-blocking)
    sendSignUpEmail(user.email, user.name).catch(error => {
      console.error('Failed to send welcome email:', error);
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;

    if (isAdmin) {
      const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminUser) {
        return res.status(401).json({ message: 'Admin user not found' });
      }
      
      // Update admin status in database
      adminUser.isAdmin = true;
      await adminUser.save();
      
      const token = generateToken(adminUser._id, true);
      return res.json({
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          isAdmin: true,
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.suspended) {
      return res.status(403).json({ 
        message: 'Account suspended',
        reason: user.suspendedReason || 'Your account has been suspended by an administrator.',
        suspendedAt: user.suspendedAt
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update admin status in database
    user.isAdmin = false;
    await user.save();

    const token = generateToken(user._id, false);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.suspended) {
      return res.status(403).json({ 
        message: 'Account suspended',
        reason: user.suspendedReason || 'Your account has been suspended by an administrator.',
        suspendedAt: user.suspendedAt
      });
    }

    res.json({ message: 'User is active', suspended: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
