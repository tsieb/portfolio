// File: /frontend/src/features/auth/services/authApi.js
// Enhanced authentication service with improved error handling and token management

import api from '../../../services/api';

/**
 * Login with admin credentials
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Authentication response
 */
const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/admin/login', { email, password });
    
    // Store token in localStorage if present
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Register with email and password
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Store token in localStorage if present
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Login with Spotify OAuth
 * @param {Object} tokenData - Spotify OAuth token data
 * @returns {Promise<Object>} Authentication response
 */
const loginWithSpotify = async (tokenData) => {
  try {
    // Validate token data
    if (!tokenData || !tokenData.access_token || !tokenData.refresh_token) {
      throw new Error('Invalid Spotify token data');
    }
    
    const response = await api.post('/auth/spotify/callback', {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in || 3600
    });
    
    // Store token in localStorage if present
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Spotify login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Exchange Spotify authorization code for tokens
 * @param {string} code - Spotify authorization code
 * @returns {Promise<Object>} Token response
 */
const exchangeSpotifyCode = async (code) => {
  try {
    if (!code) {
      throw new Error('Authorization code is required');
    }
    
    const response = await api.post('/auth/spotify/token', { code });
    return response.data;
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout response
 */
const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    return response.data;
  } catch (error) {
    // Remove token even if API call fails
    localStorage.removeItem('token');
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} User data
 */
const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    // Don't log error for auth check (common for non-logged in users)
    if (error.response && error.response.status === 401) {
      throw error;
    }
    
    console.error('Get current user error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Validate username availability
 * @param {string} username - Username to validate
 * @returns {Promise<Object>} Validation result
 */
const validateUsername = async (username) => {
  try {
    const response = await api.post('/auth/username/validate', { username });
    return response.data;
  } catch (error) {
    console.error('Username validation error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Complete user onboarding
 * @param {Object} userData - User profile data
 * @returns {Promise<Object>} Updated user data
 */
const completeOnboarding = async (userData) => {
  try {
    const response = await api.post('/auth/onboarding', userData);
    return response.data;
  } catch (error) {
    console.error('Onboarding error:', error.response?.data || error.message);
    throw error;
  }
};

const authService = {
  adminLogin,
  register,
  loginWithSpotify,
  exchangeSpotifyCode,
  logout,
  getCurrentUser,
  validateUsername,
  completeOnboarding
};

export default authService;