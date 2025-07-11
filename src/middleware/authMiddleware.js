const jwt = require('jsonwebtoken');
const { ErrorFactory } = require('../utils/errors');
const { asyncHandler } = require('./errorMiddleware');
const config = require('../config/config');

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ErrorFactory.unauthorized('Access denied. No valid token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ErrorFactory.unauthorized('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw ErrorFactory.unauthorized('Invalid token');
    }
    throw ErrorFactory.unauthorized('Token verification failed');
  }
});

/**
 * Authorization middleware to check user roles
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw ErrorFactory.unauthorized('Access denied. User not authenticated.');
  }

  if (roles.length > 0 && !roles.includes(req.user.role)) {
    throw ErrorFactory.forbidden('Access denied. Insufficient permissions.');
  }

  next();
};

/**
 * Optional authentication middleware - doesn't throw error if no token
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
    } catch (error) {
      // Silently ignore invalid tokens in optional auth
      req.user = null;
    }
  }

  next();
});

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
