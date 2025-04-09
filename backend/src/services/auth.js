// File: /backend/src/services/auth.js
// Authentication service for user management and auth operations

const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

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
    secure: process.env.NODE_ENV === 'production'
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
 * Logs in a user and generates JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password'
    });
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Incorrect email or password'
    });
  }

  // If everything ok, send token to client
  createSendToken(user, 200, res);
};

/**
 * Logs out a user by clearing the JWT cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({ status: 'success' });
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
      
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      });
      
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

/**
 * Checks the current authenticated user from the request
 * @param {Object} req - Express request object
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
const getCurrentUser = async (req) => {
  if (!req.user) return null;
  return req.user;
};

module.exports = {
  login,
  logout,
  createAdminUser,
  getCurrentUser,
  createSendToken,
  signToken
};