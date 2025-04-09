// File: /backend/src/routes/api/auth.js
// Enhanced authentication routes with Spotify OAuth

const express = require('express');
const { body } = require('express-validator');
const authService = require('../../services/auth');
const { protect, restrictTo } = require('../../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.'
  }
});

/**
 * @route   GET /api/auth/spotify
 * @desc    Redirect to Spotify OAuth
 * @access  Public
 */
router.get('/spotify', (req, res) => {
  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-top-read',
    'user-read-email',
    'user-read-private'
  ];
  
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes.join(' '))}&show_dialog=true`;
  
  res.redirect(spotifyAuthUrl);
});

/**
 * @route   GET /api/auth/spotify/callback
 * @desc    Handle Spotify OAuth callback
 * @access  Public
 */
router.get('/spotify/callback', authService.handleSpotifyCallback);

/**
 * @route   POST /api/auth/spotify/exchange
 * @desc    Exchange authorization code for tokens
 * @access  Public
 */
router.post('/spotify/exchange', authLimiter, authService.exchangeSpotifyCode);

/**
 * @route   POST /api/auth/spotify/callback
 * @desc    Handle Spotify OAuth callback and user login
 * @access  Public
 */
router.post('/spotify/callback', authLimiter, authService.spotifyCallback);

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login with email and password
 * @access  Public
 */
router.post(
  '/admin/login',
  authLimiter,
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  authService.adminLogin
);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user and clear cookie
 * @access  Public
 */
router.get('/logout', authService.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, authService.getCurrentUser);

/**
 * @route   POST /api/auth/username/validate
 * @desc    Validate if username is available
 * @access  Public
 */
router.post('/username/validate', authService.validateUsername);

/**
 * @route   POST /api/auth/onboarding
 * @desc    Complete user onboarding
 * @access  Private
 */
router.post('/onboarding', protect, authService.completeOnboarding);

module.exports = router;