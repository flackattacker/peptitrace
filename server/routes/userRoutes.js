const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('userRoutes.js: Loading user routes file');

// Add logging middleware for all user routes
router.use((req, res, next) => {
  console.log(`userRoutes: ${req.method} ${req.originalUrl} called`);
  console.log('userRoutes: Request headers:', req.headers);
  console.log('userRoutes: Request body:', req.body);
  console.log('userRoutes: Request query:', req.query);
  next();
});

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  console.log('userRoutes: GET /me endpoint hit');
  console.log('userRoutes: User from token:', req.user);
  console.log('userRoutes: User ID from token:', req.user._id);
  console.log('userRoutes: User ID type:', typeof req.user._id);
  try {
    const user = await UserService.getUserById(req.user._id);
    console.log('userRoutes: User found:', user);

    if (!user) {
      console.log('userRoutes: User not found in database');
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('userRoutes: Error in GET /me:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route PUT /api/users/me
 * @desc Update current user profile
 * @access Private
 */
router.put('/me', authenticateToken, async (req, res) => {
  console.log('userRoutes: PUT /me endpoint hit');
  console.log('userRoutes: User from token:', req.user);
  console.log('userRoutes: User ID from token:', req.user._id);
  console.log('userRoutes: Update data:', req.body);
  try {
    const updatedUser = await UserService.updateUser(req.user._id, req.body);
    console.log('userRoutes: User updated:', updatedUser);

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('userRoutes: Error in PUT /me:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  console.log('userRoutes: POST /register endpoint hit');
  try {
    let { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Generate username from email
    const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 8);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await UserService.createUser({
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          demographics: user.demographics,
          preferences: user.preferences
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('userRoutes: Error in POST /register:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/users/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  console.log('userRoutes: POST /login endpoint hit');
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          demographics: user.demographics,
          preferences: user.preferences
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('userRoutes: Error in POST /login:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

console.log('userRoutes.js: Routes defined successfully');

module.exports = router;