const jwt = require('jsonwebtoken');
const AuthService = require('../services/AuthService.js');

console.log('Loading auth middleware...');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const user = await AuthService.verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
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