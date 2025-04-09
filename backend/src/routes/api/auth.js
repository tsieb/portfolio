// File: /backend/src/routes/api/auth.js
// Authentication routes

const express = require('express');
const { body } = require('express-validator');
const authService = require('../../services/auth');
const { protect } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    // Validate request body
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  (req, res) => authService.login(req, res)
);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user and clear cookie
 * @access  Public
 */
router.get('/logout', (req, res) => authService.logout(req, res));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;