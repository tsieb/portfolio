// /backend/src/routes/api/auth.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../../db/models/user');
const { protect, admin } = require('../../middleware/auth');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation Error',
        details: errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }))
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_ERROR';
      throw error;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_ERROR';
      throw error;
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(200).json({
      status: 'success',
      token,
      user: userData
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    // User is already attached to req by protect middleware
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user / clear cookie
 * @access  Private
 */
router.post(
  '/logout',
  protect,
  asyncHandler(async (req, res) => {
    // In a stateless JWT approach, we just tell the client to remove the token
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  })
);

// For development and testing - should be removed in production
if (process.env.NODE_ENV === 'development') {
  /**
   * @route   POST /api/auth/seed
   * @desc    Seed an admin user for development
   * @access  Public - only in development
   */
  router.post(
    '/seed',
    asyncHandler(async (req, res) => {
      // Check if an admin already exists
      const adminExists = await User.findOne({ role: 'admin' });
      
      if (adminExists) {
        return res.status(200).json({
          status: 'success',
          message: 'Admin user already exists',
          data: {
            email: adminExists.email
          }
        });
      }
      
      // Create admin user
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'admin'
      });
      
      res.status(201).json({
        status: 'success',
        message: 'Admin user created',
        data: {
          email: admin.email
        }
      });
    })
  );
}

module.exports = router;