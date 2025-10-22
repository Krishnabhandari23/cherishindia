const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Token is valid but user not found.' 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          success: false,
          message: 'User account is deactivated.' 
        });
      }

      req.user = user;
      next();
    } catch (tokenError) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token.' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error in authentication.',
      error: error.message 
    });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required.' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error in admin authentication.',
      error: error.message 
    });
  }
};

// Middleware for optional authentication (user may or may not be logged in)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (tokenError) {
        // Invalid token, but we continue without setting req.user
        console.log('Invalid token in optional auth:', tokenError.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth,
  generateToken,
  generateRefreshToken
};