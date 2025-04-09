// File: /frontend/src/features/spotify/services/spotifyApi.js
// Updated Spotify service with user-specific endpoints

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
  getRecentlyPlayed,
  getStats,
  refreshData
};

export default spotifyService;