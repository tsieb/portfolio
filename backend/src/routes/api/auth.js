// File: /backend/src/routes/api/auth.js
// Enhanced authentication routes with Spotify OAuth

const { User } = require('../../db/models'); // Ensure User model is imported
const { AppError } = require('../../middleware/error'); // Import AppError
const crypto = require('crypto');
const express = require('express');
const { body } = require('express-validator');
const authService = require('../../services/auth');
const spotifyService = require('../../services/spotify');
const { protect, restrictTo } = require('../../middleware/auth');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

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
  
  // This redirect_uri must match exactly what's configured in the Spotify Developer Dashboard
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  
  // This URL will send the user to Spotify's auth page
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes.join(' '))}&show_dialog=true`;
  
  // Log where we're redirecting to help with debugging
  console.log(`Redirecting to Spotify OAuth: ${spotifyAuthUrl}`);
  
  res.redirect(spotifyAuthUrl);
});

/**
 * @route   GET /api/auth/spotify/callback
 * @desc    Handle Spotify OAuth callback directly from Spotify
 * @access  Public
 */
router.get('/spotify/callback', async (req, res, next) => {
  try {
    // This is called directly by Spotify's redirect
    const { code, error } = req.query;
    
    // Log the code received (first few characters only for security)
    console.log(`Received Spotify callback: code=${code ? (code.substring(0, 10) + '...') : 'undefined'}, error=${error || 'none'}`);
    
    if (error) {
      // Redirect to frontend with error information
      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent(error)}`);
    }
    
    if (!code) {
      // Redirect to frontend with error information
      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?error=missing_code`);
    }
    
    // Exchange the code for tokens
    try {
      // Get credentials from environment
      const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
      
      // Exchange code for tokens with Spotify
      const tokenEndpoint = 'https://accounts.spotify.com/api/token';
      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const formData = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      });
      
      const tokenResponse = await axios({
        method: 'post',
        url: tokenEndpoint,
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      });
      
      // Get Spotify user profile with access token
      const spotifyUser = await spotifyService.getUserProfile(tokenResponse.data.access_token);
      
      // Find or create our user
      let user = await User.findOne({ spotifyId: spotifyUser.id });
      
      if (!user) {
        // Create new user from Spotify data
        let username = spotifyUser.display_name
          ? spotifyUser.display_name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
          : `user_${crypto.randomBytes(4).toString('hex')}`;
        
        // Ensure unique username
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
          username = `${username}_${crypto.randomBytes(4).toString('hex')}`;
        }
        
        user = await User.create({
          email: spotifyUser.email || `${username}@spotifyuser.com`,
          username,
          password: crypto.randomBytes(16).toString('hex'),
          displayName: spotifyUser.display_name,
          avatar: spotifyUser.images && spotifyUser.images.length > 0 ? spotifyUser.images[0].url : null,
          spotifyId: spotifyUser.id,
          spotifyToken: {
            accessToken: tokenResponse.data.access_token,
            refreshToken: tokenResponse.data.refresh_token,
            expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000)
          },
          spotifyConnected: true,
          onboardingCompleted: false
        });
      } else {
        // Update existing user
        user.spotifyToken = {
          accessToken: tokenResponse.data.access_token,
          refreshToken: tokenResponse.data.refresh_token,
          expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000)
        };
        user.spotifyConnected = true;
        
        // Update profile if needed
        if (spotifyUser.display_name && !user.displayName) {
          user.displayName = spotifyUser.display_name;
        }
        
        if (spotifyUser.images && spotifyUser.images.length > 0 && !user.avatar) {
          user.avatar = spotifyUser.images[0].url;
        }
        
        await user.save();
      }
      
      // Create JWT token for our app
      const token = signToken(user._id);
      
      // Redirect to frontend with success and token
      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true&token=${token}`);
      
    } catch (exchangeError) {
      console.error('Token exchange error:', exchangeError);
      
      // Redirect to frontend with error information
      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent('token_exchange_failed')}&details=${encodeURIComponent(exchangeError.message)}`);
    }
  } catch (error) {
    console.error('Spotify callback error:', error);
    
    // Redirect to frontend with error information
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent('server_error')}&details=${encodeURIComponent(error.message)}`);
  }
});

// /**
//  * @route   POST /api/auth/spotify/exchange
//  * @desc    Exchange authorization code for tokens
//  * @access  Public
//  */
// router.post('/spotify/exchange', authLimiter, authService.exchangeSpotifyCode);

// /**
//  * @route   POST /api/auth/spotify/callback
//  * @desc    Handle Spotify OAuth callback and user login
//  * @access  Public
//  */
// router.post('/spotify/callback', authLimiter, authService.spotifyCallback);

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