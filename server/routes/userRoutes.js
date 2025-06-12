const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const { authenticateToken } = require('./middleware/auth');

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

console.log('userRoutes.js: Routes defined successfully');

module.exports = router;