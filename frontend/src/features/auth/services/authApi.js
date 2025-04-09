// File: /frontend/src/features/auth/services/authApi.js
// Auth service focused on Spotify OAuth and admin login

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

const authService = {
  adminLogin,
  loginWithSpotify,
  exchangeSpotifyCode,
  logout,
  getCurrentUser
};

export default authService;