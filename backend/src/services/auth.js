// File: /backend/src/services/auth.js
// Enhanced auth service with Spotify OAuth support

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../db/models');
const spotifyService = require('./spotify');
const { AppError } = require('../middleware/error');
const axios = require('axios');

/**
 * Signs a JWT token for a user
 * @param {string} id - User ID to include in token
 * @returns {string} JWT token
 */
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
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
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
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

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.role !== 'admin' || !(await user.correctPassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Exchange Spotify authorization code for tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const exchangeSpotifyCode = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(new AppError('Authorization code is required', 400));
    }

    // Exchange code for tokens
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const authString = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios({
      method: 'post',
      url: tokenEndpoint,
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

    res.status(200).json({
      status: 'success',
      data: response.data
    });
  } catch (error) {
    console.error('Spotify token exchange error:', error.response?.data || error.message);
    next(new AppError('Failed to exchange authorization code', 500));
  }
};

/**
 * Handle Spotify OAuth callback and user creation/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const spotifyCallback = async (req, res, next) => {
  try {
    const { access_token, refresh_token, expires_in } = req.body;

    if (!access_token || !refresh_token) {
      return next(new AppError('Access token and refresh token are required', 400));
    }

    // Get Spotify user profile with the access token
    const spotifyUser = await spotifyService.getUserProfile(access_token);

    if (!spotifyUser || !spotifyUser.id) {
      return next(new AppError('Failed to get Spotify user profile', 500));
    }

    // Check if user exists with this Spotify ID
    let user = await User.findOne({ spotifyId: spotifyUser.id });
    
    // If no user exists, create a new one
    if (!user) {
      // Generate a unique username based on Spotify display name
      let username = spotifyUser.display_name
        ? spotifyUser.display_name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
        : `user_${crypto.randomBytes(4).toString('hex')}`;
      
      // Check if username exists, if so, add a random suffix
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        username = `${username}_${crypto.randomBytes(4).toString('hex')}`;
      }
      
      // Create new user
      user = await User.create({
        email: spotifyUser.email || `${username}@spotifyuser.com`,
        username,
        password: crypto.randomBytes(16).toString('hex'), // Random secure password
        displayName: spotifyUser.display_name,
        avatar: spotifyUser.images && spotifyUser.images.length > 0 ? spotifyUser.images[0].url : null,
        spotifyId: spotifyUser.id,
        spotifyToken: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: new Date(Date.now() + expires_in * 1000)
        },
        spotifyConnected: true,
        onboardingCompleted: false
      });
    } else {
      // Update existing user's Spotify token
      user.spotifyToken = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000)
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

    // Create and send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Spotify callback error:', error);
    next(new AppError('Authentication with Spotify failed', 500));
  }
};

/**
 * Logs out a user by clearing the JWT cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  res.status(200).json({ status: 'success' });
};

/**
 * Get current authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already available in req from the protect middleware
    if (!req.user) {
      return next(new AppError('You are not logged in', 401));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates an admin user if one doesn't exist
 * Used during application startup
 * @returns {Promise<void>}
 */
const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ 
      email: process.env.ADMIN_EMAIL,
      role: 'admin'
    });
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      const username = 'admin';
      
      await User.create({
        email: process.env.ADMIN_EMAIL,
        username,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        displayName: 'Admin User',
        isPublic: false,
        onboardingCompleted: true
      });
      
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
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

    if (!username) {
      return next(new AppError('Username is required', 400));
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      return next(new AppError('Username must be 3-20 characters and can only contain letters, numbers, underscores and hyphens', 400));
    }

    // Check if username exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });

    if (existingUser) {
      return next(new AppError('Username is already taken', 400));
    }

    res.status(200).json({
      status: 'success',
      message: 'Username is available',
      data: {
        available: true
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete user onboarding
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const completeOnboarding = async (req, res, next) => {
  try {
    const { username, displayName, bio, isPublic } = req.body;

    // Validate username if provided
    if (username && username !== req.user.username) {
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
        return next(new AppError('Username must be 3-20 characters and can only contain letters, numbers, underscores and hyphens', 400));
      }

      const existingUser = await User.findOne({ username: username.toLowerCase() });
      if (existingUser && !existingUser._id.equals(req.user._id)) {
        return next(new AppError('Username is already taken', 400));
      }
    }

    // Update user profile
    const updates = {};
    if (username) updates.username = username;
    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    updates.onboardingCompleted = true;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signToken,
  createSendToken,
  adminLogin,
  exchangeSpotifyCode,
  spotifyCallback,
  logout,
  getCurrentUser,
  createAdminUser,
  validateUsername,
  completeOnboarding
};