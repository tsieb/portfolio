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
 * @returns {Promise<Object>} Users data
 */
const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data.data.users;
  } catch (error) {
    throw error;
  }
};

const adminService = {
  getDashboardData,
  getTracks,
  deleteTrack,
  getUsers
};

export default adminService;