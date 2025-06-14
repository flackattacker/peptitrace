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
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create new user
    const user = await UserService.createUser({
      username,
      email,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
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
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
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