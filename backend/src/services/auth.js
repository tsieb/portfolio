// File: /backend/src/services/auth.js
// Authentication service with improved error handling and separation of concerns

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const { User } = require('../db/models');
const spotifyService = require('./spotify');
const { AppError } = require('../middleware/error');
const logger = require('../utils/logger');

/**
 * Signs a JWT token for a user
 * @param {string} id - User ID to include in token
 * @returns {string} JWT token
 */
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Creates a token and sends it as an HTTP-only cookie
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  // Set JWT cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  
  // Send response with token and user data
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/**
 * Initiate Spotify OAuth flow
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const initiateSpotifyAuth = (req, res) => {
  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-top-read',
    'user-read-email',
    'user-read-private'
  ];
  
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  
  if (!clientId || !redirectUri) {
    logger.error('Missing Spotify credentials in environment');
    return res.redirect(
      `/auth/callback?error=server_error&details=${encodeURIComponent('Server configuration error')}`
    );
  }
  
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes.join(' '))}&show_dialog=true`;
  
  res.redirect(spotifyAuthUrl);
};

/**
 * Handle Spotify OAuth callback - redirects to frontend with token or error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleSpotifyCallback = async (req, res) => {
  const { code, error } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  // If Spotify returns an error, redirect to frontend with error
  if (error) {
    logger.error(`Spotify auth error: ${error}`);
    return res.redirect(
      `${frontendUrl}/auth/callback?error=${error}`
    );
  }
  
  // If no code is present, redirect with error
  if (!code) {
    logger.error('No authorization code provided by Spotify');
    return res.redirect(
      `${frontendUrl}/auth/callback?error=missing_code`
    );
  }
  
  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    
    // Get user profile from Spotify
    const spotifyUser = await spotifyService.getUserProfile(tokens.access_token);
    
    // Create or update user
    const user = await findOrCreateUser(spotifyUser, tokens);
    
    // Generate JWT token
    const token = signToken(user._id);
    
    // Redirect to frontend with success and token
    res.redirect(
      `${frontendUrl}/auth/callback?success=true&token=${token}`
    );
  } catch (error) {
    logger.error('Spotify callback error:', error);
    
    // Redirect to frontend with error details
    res.redirect(
      `${frontendUrl}/auth/callback?error=authentication_failed&details=${encodeURIComponent(error.message)}`
    );
  }
};

/**
 * Exchange Spotify authorization code for tokens (API endpoint)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const exchangeSpotifyToken = async (req, res, next) => {
  try {
    const { code } = req.body;
    
    // Exchange code for tokens
    const tokenData = await exchangeCodeForTokens(code);
    
    // Return tokens to frontend
    res.status(200).json({
      status: 'success',
      data: tokenData
    });
  } catch (error) {
    logger.error('Token exchange error:', error);
    next(new AppError(`Failed to exchange token: ${error.message}`, 500));
  }
};

/**
 * Admin login with email and password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and is admin
    if (!user || user.role !== 'admin') {
      return next(new AppError('Invalid credentials', 401));
    }
    
    // Check password
    const isPasswordCorrect = await user.correctPassword(password);
    if (!isPasswordCorrect) {
      return next(new AppError('Invalid credentials', 401));
    }
    
    // Send token
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Admin login error:', error);
    next(new AppError('Authentication failed', 500));
  }
};

/**
 * Logout user by clearing JWT cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
  res.cookie('jwt', 'logged-out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

/**
 * Get current authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentUser = (req, res) => {
  // User is already available from protect middleware
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

/**
 * Validate if a username is available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    
    // Check username format
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      return next(new AppError('Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens', 400));
    }
    
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(200).json({
        status: 'success',
        data: { available: false, message: 'Username is already taken' }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { available: true, message: 'Username is available' }
    });
  } catch (error) {
    logger.error('Username validation error:', error);
    next(new AppError('Failed to validate username', 500));
  }
};

/**
 * Complete user onboarding after OAuth login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const completeOnboarding = async (req, res, next) => {
  try {
    const { username, displayName, bio, isPublic } = req.body;
    const updates = {};
    
    // If username is being updated, check availability
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return next(new AppError('Username is already taken', 400));
      }
      
      updates.username = username;
    }
    
    // Update other fields if provided
    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    
    // Mark onboarding as completed
    updates.onboardingCompleted = true;
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );
    
    // Return updated user
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    logger.error('Onboarding completion error:', error);
    next(new AppError('Failed to complete onboarding', 500));
  }
};

/**
 * Create admin user on application startup if not exists
 */
const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      logger.warn('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables');
      return;
    }
    
    const adminExists = await User.findOne({ email: adminEmail, role: 'admin' });
    
    if (!adminExists) {
      logger.info('Creating admin user...');
      
      await User.create({
        email: adminEmail,
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        displayName: 'Administrator',
        isPublic: true,
        onboardingCompleted: true
      });
      
      logger.info('Admin user created successfully');
    }
  } catch (error) {
    logger.error('Error creating admin user:', error);
  }
};

// ===== Helper Functions =====

/**
 * Exchange Spotify authorization code for tokens
 * @param {string} code - Authorization code from Spotify
 * @returns {Promise<Object>} Tokens from Spotify
 */
const exchangeCodeForTokens = async (code) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    
    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing Spotify credentials in environment');
    }
    
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });
    
    return response.data;
  } catch (error) {
    logger.error('Error exchanging code for tokens:', error.response?.data || error);
    throw new Error(error.response?.data?.error_description || 'Failed to exchange authorization code');
  }
};

/**
 * Find or create user from Spotify profile
 * @param {Object} spotifyUser - User profile from Spotify
 * @param {Object} tokens - Access and refresh tokens
 * @returns {Promise<Object>} User document
 */
const findOrCreateUser = async (spotifyUser, tokens) => {
  if (!spotifyUser || !spotifyUser.id) {
    throw new Error('Invalid Spotify user data');
  }
  
  // Check if user exists
  let user = await User.findOne({ spotifyId: spotifyUser.id });
  
  if (user) {
    // Update existing user
    user.spotifyToken = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000)
    };
    user.spotifyConnected = true;
    
    // Update profile data if missing
    if (spotifyUser.display_name && !user.displayName) {
      user.displayName = spotifyUser.display_name;
    }
    
    if (spotifyUser.images && spotifyUser.images.length > 0 && !user.avatar) {
      user.avatar = spotifyUser.images[0].url;
    }
    
    await user.save();
    return user;
  } else {
    // Create new user
    // Generate username based on Spotify display name or random string
    let username = spotifyUser.display_name
      ? spotifyUser.display_name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
      : `user_${crypto.randomBytes(4).toString('hex')}`;
      
    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      username = `${username}_${crypto.randomBytes(4).toString('hex')}`;
    }
    
    // Create user
    return await User.create({
      email: spotifyUser.email || `${username}@spotifyuser.com`,
      username,
      password: crypto.randomBytes(16).toString('hex'), // Random secure password
      displayName: spotifyUser.display_name,
      avatar: spotifyUser.images && spotifyUser.images.length > 0 ? spotifyUser.images[0].url : null,
      spotifyId: spotifyUser.id,
      spotifyToken: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000)
      },
      spotifyConnected: true,
      onboardingCompleted: false
    });
  }
};

module.exports = {
  signToken,
  createSendToken,
  initiateSpotifyAuth,
  handleSpotifyCallback,
  exchangeSpotifyToken,
  adminLogin,
  logout,
  getCurrentUser,
  validateUsername,
  completeOnboarding,
  createAdminUser
};