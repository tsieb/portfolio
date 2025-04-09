// File: /backend/src/middleware/auth.js
// Authentication middleware with improved error handling and token management

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { User } = require('../db/models');
const { AppError } = require('./error');
const logger = require('../utils/logger');

/**
 * Protect routes that require authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.protect = async (req, res, next) => {
  try {
    // 1) Get the token
    let token;
    
    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Then check cookie
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    // If no token, return error
    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }
    
    // 2) Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    
    // 4) Check if user changed password after token was issued
    if (currentUser.passwordChangedAt && currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 401));
    }
    
    // Update last active timestamp
    currentUser.lastActive = Date.now();
    await currentUser.save({ validateBeforeSave: false });
    
    // Grant access to protected route - set user on request
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
    
    logger.error('Authentication error:', error);
    return next(new AppError('Authentication failed. Please log in again.', 401));
  }
};

/**
 * Restrict access to specific roles
 * @param  {...string} roles - Array of roles that are allowed
 * @returns {Function} Middleware function
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

/**
 * Check if user can access a protected profile
 * @param {string} paramField - Request parameter field containing username or ID
 * @param {boolean} allowSameUser - Whether to allow users to access their own profile
 * @returns {Function} Middleware function
 */
exports.checkProfileAccess = (paramField = 'username', allowSameUser = true) => {
  return async (req, res, next) => {
    try {
      // Skip for admin users
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      
      // Get target user based on parameter
      const param = req.params[paramField];
      let targetUser;
      
      if (paramField === 'username') {
        targetUser = await User.findOne({ username: param });
      } else {
        targetUser = await User.findById(param);
      }
      
      // If user not found
      if (!targetUser) {
        return next(new AppError('User not found', 404));
      }
      
      // Allow access to own profile
      if (allowSameUser && req.user && req.user._id.equals(targetUser._id)) {
        req.targetUser = targetUser;
        return next();
      }
      
      // Allow access to public profiles
      if (targetUser.isPublic) {
        req.targetUser = targetUser;
        return next();
      }
      
      // Check if current user is in allowed viewers
      if (req.user && 
          targetUser.allowedViewers && 
          targetUser.allowedViewers.some(id => id.equals(req.user._id))) {
        req.targetUser = targetUser;
        return next();
      }
      
      // If we get here, access is denied
      return next(new AppError('You do not have permission to view this profile', 403));
    } catch (error) {
      logger.error('Profile access check error:', error);
      return next(new AppError('Error checking profile access', 500));
    }
  };
};

/**
 * Check if user is the owner of a resource
 * @param {Function} getResourceOwner - Function to get resource owner ID
 * @returns {Function} Middleware function
 */
exports.checkOwnership = (getResourceOwner) => {
  return async (req, res, next) => {
    try {
      // Skip for admin users
      if (req.user.role === 'admin') {
        return next();
      }
      
      // Get owner ID using provided function
      const ownerId = await getResourceOwner(req);
      
      if (!ownerId) {
        return next(new AppError('Resource not found', 404));
      }
      
      // Check if user is owner
      if (req.user._id.equals(ownerId)) {
        return next();
      }
      
      return next(new AppError('You do not have permission to perform this action', 403));
    } catch (error) {
      logger.error('Ownership check error:', error);
      return next(new AppError('Error checking resource ownership', 500));
    }
  };
};

/**
 * Optional auth middleware - populates req.user if authenticated
 * but doesn't block access if not
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
      }
    }
    
    next();
  } catch (error) {
    // Silently handle token errors and continue
    next();
  }
};