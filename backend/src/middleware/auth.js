// /backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../db/models/user');
const config = require('../config/env');

/**
 * Middleware to protect routes - verifies JWT token
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token from Bearer header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    error.code = 'AUTHENTICATION_ERROR';
    throw error;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Find user from decoded token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      const error = new Error('Not authorized, user not found');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_ERROR';
      throw error;
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      const authError = new Error('Not authorized, invalid token');
      authError.statusCode = 401;
      authError.code = 'AUTHENTICATION_ERROR';
      throw authError;
    } else {
      throw error;
    }
  }
});

/**
 * Middleware to check if user is admin
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    const error = new Error('Not authorized as admin');
    error.statusCode = 403;
    error.code = 'AUTHORIZATION_ERROR';
    throw error;
  }
});

module.exports = {
  protect,
  admin
};