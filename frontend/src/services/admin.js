// File: /frontend/src/services/admin.js
// Admin service for admin-specific API calls

import api from './api';

/**
 * Get admin dashboard data
 * @returns {Promise<Object>} Dashboard data
 */
const getDashboardData = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get tracks with pagination, sorting, and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Tracks per page
 * @param {string} options.sort - Sort field
 * @param {string} options.order - Sort order (asc/desc)
 * @param {string} options.artist - Filter by artist name
 * @param {string} options.track - Filter by track name
 * @param {string} options.album - Filter by album name
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @returns {Promise<Object>} Tracks data with pagination
 */
const getTracks = async (options = {}) => {
  try {
    const response = await api.get('/admin/tracks', { params: options });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a track by ID
 * @param {string} id - Track ID
 * @returns {Promise<Object>} Delete response
 */
const deleteTrack = async (id) => {
  try {
    const response = await api.delete(`/admin/tracks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users (admin only)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Users per page
 * @param {string} options.search - Search query
 * @param {string} options.sort - Sort field
 * @param {string} options.order - Sort order (asc/desc)
 * @param {boolean} options.onlySpotifyConnected - Filter by Spotify connected users
 * @returns {Promise<Object>} Users data with pagination
 */
const getUsers = async (options = {}) => {
  try {
    const response = await api.get('/admin/users', { params: options });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User data
 */
const getUserById = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user data
 */
const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<Object>} Delete response
 */
const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create test user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createTestUser = async (userData) => {
  try {
    const response = await api.post('/admin/users/create', userData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get application settings
 * @returns {Promise<Object>} App settings
 */
const getAppSettings = async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update application settings
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
const updateAppSettings = async (settings) => {
  try {
    const response = await api.put('/admin/settings', settings);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const adminService = {
  getDashboardData,
  getTracks,
  deleteTrack,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createTestUser,
  getAppSettings,
  updateAppSettings
};

export default adminService;