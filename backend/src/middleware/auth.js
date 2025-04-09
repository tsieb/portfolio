// File: /backend/src/middleware/auth.js
// Enhanced authentication middleware with ownership checks

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { User } = require('../db/models');
const { AppError } = require('./error');

/**
 * Middleware to protect routes by requiring authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from authorization header or cookies
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 401));
    }

    // Update last active timestamp
    currentUser.lastActive = Date.now();
    await currentUser.save({ validateBeforeSave: false });

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Not authorized', 401));
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - Roles allowed to access the route
 * @returns {Function} Express middleware function
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in the roles array
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    
    next();
  };
};

/**
 * Middleware to check if user can access a protected profile
 * @param {string} paramField - The request parameter field containing the username or userId
 * @param {boolean} allowSameUser - Whether to allow the same user to access the route
 * @returns {Function} Express middleware function
 */
exports.checkProfileAccess = (paramField = 'username', allowSameUser = true) => {
  return async (req, res, next) => {
    try {
      // Skip if user is admin - admins can access all profiles
      if (req.user.role === 'admin') {
        return next();
      }

      let targetUser;
      const param = req.params[paramField];

      if (paramField === 'username') {
        targetUser = await User.findOne({ username: param });
      } else if (paramField === 'userId') {
        targetUser = await User.findById(param);
      } else {
        targetUser = await User.findById(param);
      }

      if (!targetUser) {
        return next(new AppError('User not found', 404));
      }

      // Allow users to access their own profile
      if (allowSameUser && req.user._id.equals(targetUser._id)) {
        req.targetUser = targetUser;
        return next();
      }

      // Check if the target user's profile is public
      if (targetUser.isPublic) {
        req.targetUser = targetUser;
        return next();
      }

      // Check if the current user is in the target user's allowed viewers
      if (targetUser.allowedViewers && targetUser.allowedViewers.some(viewer => 
        viewer.equals(req.user._id)
      )) {
        req.targetUser = targetUser;
        return next();
      }

      return next(new AppError('You do not have permission to view this profile', 403));
    } catch (error) {
      return next(new AppError('Error checking profile access', 500));
    }
  };
};

/**
 * Middleware to check if user is the owner of a resource
 * @param {Function} getResourceOwner - Function to get the owner of the resource
 * @returns {Function} Express middleware function
 */
exports.checkOwnership = (getResourceOwner) => {
  return async (req, res, next) => {
    try {
      // Skip if user is admin - admins can access all resources
      if (req.user.role === 'admin') {
        return next();
      }

      const ownerId = await getResourceOwner(req);

      if (!ownerId) {
        return next(new AppError('Resource not found', 404));
      }

      // Check if the user is the owner
      if (req.user._id.equals(ownerId)) {
        return next();
      }

      return next(new AppError('You are not authorized to access this resource', 403));
    } catch (error) {
      return next(new AppError('Error checking resource ownership', 500));
    }
  };
};

/**
 * Middleware to check if user is logged in (for UI state)
 * Does not block the request if not authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      req.user = currentUser;
      return next();
    }
  } catch (err) {
    // No logged in user
  }
  next();
};