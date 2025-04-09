// File: /frontend/src/features/auth/services/authApi.js
// Enhanced auth service with improved token validation

import api from '../../../services/api';

/**
 * Admin login with email and password
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Auth response with user data and token
 */
const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/admin/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error.response?.data || error);
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
    console.log('Processing login with Spotify tokens...');
    
    // Validate token data structure
    if (!tokenData) {
      throw new Error('No token data provided');
    }
    
    if (!tokenData.access_token) {
      throw new Error('Missing access_token in Spotify token data');
    }
    
    if (!tokenData.refresh_token) {
      throw new Error('Missing refresh_token in Spotify token data');
    }

    // Send tokens to backend for authentication
    const response = await api.post('/auth/spotify/callback', {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in || 3600
    });
    
    // Store token and return user data
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Authentication successful: JWT token stored');
    } else {
      console.warn('Warning: No JWT token received from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Spotify login error:', error.response?.data || error);
    throw error;
  }
};

/**
 * Exchange Spotify authorization code for tokens
 * @param {string} code - Authorization code from Spotify OAuth
 * @returns {Promise<Object>} Token response with consistent structure
 */
const exchangeSpotifyCode = async (code) => {
  try {
    if (!code) {
      throw new Error('Authorization code is required');
    }
    
    const response = await api.post('/auth/spotify/exchange', { code });
    
    // Make sure we're returning a consistent structure
    // The backend returns { status: 'success', data: { tokens } }
    if (!response.data || !response.data.data) {
      console.error('Unexpected response structure:', response);
      throw new Error('Unexpected response structure from server');
    }
    
    return {
      data: response.data.data // Extract the actual token data
    };
  } catch (error) {
    console.error('Code exchange error:', error.response?.data || error);
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
    console.error('Get current user error:', error.response?.data || error);
    throw error;
  }
};

const authService = {
  adminLogin,
  loginWithSpotify,
  exchangeSpotifyCode,
  logout,
  getCurrentUser
};

export default authService;