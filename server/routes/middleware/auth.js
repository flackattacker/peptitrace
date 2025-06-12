console.log('Loading auth middleware...');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
  try {
    console.log('authenticateToken middleware called');
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    console.log('Token found, attempting to verify...');
    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
    console.log('JWT_ACCESS_SECRET exists in middleware:', !!process.env.JWT_ACCESS_SECRET);
    console.log('JWT_ACCESS_SECRET value (first 10 chars):', process.env.JWT_ACCESS_SECRET ? process.env.JWT_ACCESS_SECRET.substring(0, 10) + '...' : 'UNDEFINED');

    if (!process.env.JWT_ACCESS_SECRET) {
      console.log('JWT_ACCESS_SECRET not found in middleware');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('Token verified successfully, decoded:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid access token'
    });
  }
};

console.log('authenticateToken function defined:', typeof authenticateToken);

const middleware = {
  authenticateToken
};

console.log('About to export auth middleware:', middleware);
console.log('Export keys:', Object.keys(middleware));
console.log('Export authenticateToken type:', typeof middleware.authenticateToken);

module.exports = middleware;

console.log('Auth middleware exported successfully');