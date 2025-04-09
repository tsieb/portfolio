// File: /backend/src/routes/api/auth.js
// Authentication routes with clearer organization and better error handling

const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../../services/auth');
const { protect } = require('../../middleware/auth');
const rateLimit = require('express-rate-limit');
const { AppError } = require('../../middleware/error');

const router = express.Router();

// Rate limiting for auth endpoints - prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 10 requests per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.'
  }
});

/**
 * Validation middleware for checking request data
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

// === Spotify OAuth Routes ===

/**
 * @route   GET /api/auth/spotify
 * @desc    Redirect to Spotify OAuth authorization page
 * @access  Public
 */
router.get('/spotify', authService.initiateSpotifyAuth);

/**
 * @route   GET /api/auth/spotify/callback
 * @desc    Handle callback from Spotify OAuth
 * @access  Public
 */
router.get('/spotify/callback', authService.handleSpotifyCallback);

/**
 * @route   POST /api/auth/spotify/token
 * @desc    Exchange authorization code for tokens
 * @access  Public
 */
router.post('/spotify/token', 
  authLimiter,
  [
    body('code', 'Authorization code is required').notEmpty(),
    validateRequest
  ],
  authService.exchangeSpotifyToken
);

// === Email/Password Auth Routes (Admin only) ===

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login with email and password
 * @access  Public
 */
router.post('/admin/login',
  authLimiter,
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').notEmpty(),
    validateRequest
  ],
  authService.adminLogin
);

// === General Auth Routes ===

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', protect, authService.getCurrentUser);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.get('/logout', authService.logout);

/**
 * @route   POST /api/auth/username/validate
 * @desc    Validate if username is available
 * @access  Public
 */
router.post('/username/validate',
  [
    body('username', 'Username is required').notEmpty(),
    validateRequest
  ],
  authService.validateUsername
);

/**
 * @route   POST /api/auth/onboarding
 * @desc    Complete user onboarding after OAuth login
 * @access  Private
 */
router.post('/onboarding',
  protect,
  [
    body('username', 'Username must be 3-20 characters and alphanumeric')
      .optional()
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-zA-Z0-9_-]+$/),
    validateRequest
  ],
  authService.completeOnboarding
);

module.exports = router;