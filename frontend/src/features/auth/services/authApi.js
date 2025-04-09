// File: /frontend/src/features/auth/services/authApi.js
// Enhanced auth service with Spotify OAuth support

import api from '../../../services/api';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth response with user data and token
 */
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login or register with Spotify OAuth
 * @param {Object} tokenData - Spotify OAuth token data
 * @returns {Promise<Object>} Auth response with user data and token
 */
const loginWithSpotify = async (tokenData) => {
  try {
    const response = await api.post('/auth/spotify/callback', tokenData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Exchange Spotify authorization code for tokens
 * @param {string} code - Authorization code from Spotify OAuth
 * @returns {Promise<Object>} Token response from Spotify
 */
const exchangeSpotifyCode = async (code) => {
  try {
    const response = await api.post('/auth/spotify/exchange', { code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Auth response with user data and token
 */
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user and clear token
 * @returns {Promise<Object>} Logout response
 */
const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Current user data
 */
const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset request response
 */
const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} Reset response
 */
const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  login,
  loginWithSpotify,
  exchangeSpotifyCode,
  register,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword
};

export default authService;