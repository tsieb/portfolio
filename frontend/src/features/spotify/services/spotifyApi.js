// File: /frontend/src/features/spotify/services/spotifyApi.js
// Spotify service with user-specific functionality and public endpoints

import api from '../../../services/api';

/**
 * Get currently playing track for a specific user
 * @param {string} userId - User ID (optional, omit for current user)
 * @returns {Promise<Object>} Currently playing track data
 */
const getCurrentlyPlaying = async (userId = null) => {
  try {
    const endpoint = userId 
      ? `/spotify/users/${userId}/now-playing` 
      : '/spotify/now-playing';
    
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get admin's currently playing track (public endpoint for homepage)
 * @returns {Promise<Object>} Currently playing track data
 */
const getPublicCurrentlyPlaying = async () => {
  try {
    const response = await api.get('/spotify/public/now-playing');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get recently played tracks for a specific user
 * @param {number} limit - Number of tracks to retrieve
 * @param {number} skip - Number of tracks to skip
 * @param {string} userId - User ID (optional, omit for current user)
 * @returns {Promise<Object>} Recently played tracks data
 */
const getRecentlyPlayed = async (limit = 10, skip = 0, userId = null) => {
  try {
    const endpoint = userId 
      ? `/spotify/users/${userId}/recently-played` 
      : '/spotify/recently-played';
    
    const response = await api.get(endpoint, {
      params: { limit, skip }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get admin's recently played tracks (public endpoint for homepage)
 * @param {number} limit - Number of tracks to retrieve
 * @param {number} skip - Number of tracks to skip
 * @returns {Promise<Object>} Recently played tracks data
 */
const getPublicRecentlyPlayed = async (limit = 10, skip = 0) => {
  try {
    const response = await api.get('/spotify/public/recently-played', {
      params: { limit, skip }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get listening statistics for a specific user
 * @param {string} userId - User ID (optional, omit for current user)
 * @returns {Promise<Object>} Listening statistics data
 */
const getStats = async (userId = null) => {
  try {
    const endpoint = userId 
      ? `/spotify/users/${userId}/stats` 
      : '/spotify/stats';
    
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get admin's listening statistics (public endpoint for homepage)
 * @returns {Promise<Object>} Listening statistics data
 */
const getPublicStats = async () => {
  try {
    const response = await api.get('/spotify/public/stats');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Force refresh of Spotify data (admin or own account only)
 * @returns {Promise<Object>} Refresh response
 */
const refreshData = async () => {
  try {
    const response = await api.get('/spotify/refresh-data');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const spotifyService = {
  getCurrentlyPlaying,
  getPublicCurrentlyPlaying,
  getRecentlyPlayed,
  getPublicRecentlyPlayed,
  getStats,
  getPublicStats,
  refreshData
};

export default spotifyService;