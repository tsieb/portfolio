// File: /frontend/src/features/user/services/userApi.js
// User service for profile management

import api from '../../../services/api';

/**
 * Get user profile by username
 * @param {string} username - Username to fetch
 * @returns {Promise<Object>} User profile data
 */
const getUserProfile = async (username) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search for users
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching users
 */
const searchUsers = async (query) => {
  try {
    const response = await api.get('/users/search', { params: { q: query } });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user privacy settings
 * @param {Object} privacySettings - Privacy settings to update
 * @returns {Promise<Object>} Updated user data
 */
const updatePrivacySettings = async (privacySettings) => {
  try {
    const response = await api.put('/users/privacy', privacySettings);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's allowed viewers
 * @returns {Promise<Array>} Array of allowed viewers
 */
const getAllowedViewers = async () => {
  try {
    const response = await api.get('/users/allowed-viewers');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add allowed viewer
 * @param {string} userId - User ID to add as viewer
 * @returns {Promise<Object>} Updated allowed viewers
 */
const addAllowedViewer = async (userId) => {
  try {
    const response = await api.post('/users/allowed-viewers', { userId });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove allowed viewer
 * @param {string} userId - User ID to remove as viewer
 * @returns {Promise<Object>} Updated allowed viewers
 */
const removeAllowedViewer = async (userId) => {
  try {
    const response = await api.delete(`/users/allowed-viewers/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  updatePrivacySettings,
  getAllowedViewers,
  addAllowedViewer,
  removeAllowedViewer
};

export default userService;