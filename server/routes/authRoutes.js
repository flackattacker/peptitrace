const express = require('express');
const UserService = require('../services/userService');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('Login endpoint called with body:', { ...req.body, password: '***' });
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log('Attempting to authenticate user:', email);

    // Check if database is available
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, returning demo user for development');
      // Return a demo user for development when DB is not available
      const demoUser = {
        _id: 'demo-user-id',
        email: email,
        demographics: {},
        preferences: {}
      };
      
      const accessToken = generateAccessToken(demoUser);
      const refreshToken = generateRefreshToken(demoUser);

      return res.json({
        success: true,
        data: {
          user: demoUser,
          accessToken,
          refreshToken
        }
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Authentication failed for user:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Authentication failed for user:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('User authenticated successfully:', user._id);

    // Generate tokens - pass the user object, not just ID
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log('Tokens generated successfully');
    console.log('AccessToken exists:', !!accessToken);
    console.log('RefreshToken exists:', !!refreshToken);
    console.log('AccessToken value (first 20 chars):', accessToken ? accessToken.substring(0, 20) + '...' : 'NULL/UNDEFINED');
    console.log('RefreshToken value (first 20 chars):', refreshToken ? refreshToken.substring(0, 20) + '...' : 'NULL/UNDEFINED');
    console.log('AccessToken type:', typeof accessToken);
    console.log('RefreshToken type:', typeof refreshToken);

    const response = {
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
    };

    console.log('Full response object keys:', Object.keys(response));
    console.log('Response data keys:', Object.keys(response.data));
    console.log('Response data accessToken:', response.data.accessToken ? 'EXISTS' : 'MISSING');
    console.log('Response data refreshToken:', response.data.refreshToken ? 'EXISTS' : 'MISSING');
    console.log('About to send response...');

    res.json(response);
    
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Login endpoint error:', error);
    res.status(400).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    console.log('Register endpoint called');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Generate username from email (everything before @)
    const username = email.split('@')[0];

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          username: user.username
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error registering user' 
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Here you would verify the refresh token and generate new tokens
    // For now, return an error
    res.status(400).json({
      success: false,
      message: 'Token refresh not implemented'
    });
  } catch (error) {
    console.error('Refresh endpoint error:', error);
    res.status(400).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// GET /api/auth/validate
router.get('/validate', async (req, res) => {
  try {
    // The authenticateToken middleware will have already verified the token
    // If we get here, the token is valid
    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;