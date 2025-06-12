const express = require('express');
const UserService = require('../services/userService');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');

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

    // Try to call the correct method
    const user = await UserService.authenticate(email, password);

    if (!user) {
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

    const user = await UserService.create({ email, password });

    // Generate access token for immediate login
    const accessToken = generateAccessToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          demographics: user.demographics,
          preferences: user.preferences
        },
        accessToken
      }
    });
  } catch (error) {
    console.error('Register endpoint error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
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

module.exports = router;