const jwt = require('jsonwebtoken');
const AuthService = require('../services/AuthService');

console.log('Loading auth middleware...');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      console.error('JWT_ACCESS_SECRET not configured');
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
  }
  next();
};

console.log('authenticateToken function defined:', typeof authenticateToken);
console.log('About to export auth middleware:', { authenticateToken, requireAuth });
console.log('Export keys:', Object.keys({ authenticateToken, requireAuth }));
console.log('Export authenticateToken type:', typeof authenticateToken);

module.exports = {
  authenticateToken,
  requireAuth
};

console.log('Auth middleware exported successfully'); 