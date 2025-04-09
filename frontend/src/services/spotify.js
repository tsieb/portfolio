// File: /frontend/src/services/spotify.js
// Spotify service for fetching Spotify data

import api from './api';

/**
 * Get currently playing track
 * @returns {Promise<Object>} Currently playing track data
 */
const getCurrentlyPlaying = async () => {
  try {
    const response = await api.get('/spotify/now-playing');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get recently played tracks
 * @param {number} limit - Number of tracks to retrieve
 * @param {number} skip - Number of tracks to skip
 * @returns {Promise<Object>} Recently played tracks data
 */
const getRecentlyPlayed = async (limit = 10, skip = 0) => {
  try {
    const response = await api.get('/spotify/recently-played', {
      params: { limit, skip }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get listening statistics
 * @returns {Promise<Object>} Listening statistics data
 */
const getStats = async () => {
  try {
    const response = await api.get('/spotify/stats');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get top tracks (admin only)
 * @param {string} timeRange - Time range (short_term, medium_term, long_term)
 * @param {number} limit - Number of tracks to retrieve
 * @returns {Promise<Object>} Top tracks data
 */
const getTopTracks = async (timeRange = 'medium_term', limit = 10) => {
  try {
    const response = await api.get('/spotify/top-tracks', {
      params: { time_range: timeRange, limit }
    });
    return response.data.data.topTracks;
  } catch (error) {
    throw error;
  }
};

/**
 * Get top artists (admin only)
 * @param {string} timeRange - Time range (short_term, medium_term, long_term)
 * @param {number} limit - Number of artists to retrieve
 * @returns {Promise<Object>} Top artists data
 */
const getTopArtists = async (timeRange = 'medium_term', limit = 10) => {
  try {
    const response = await api.get('/spotify/top-artists', {
      params: { time_range: timeRange, limit }
    });
    return response.data.data.topArtists;
  } catch (error) {
    throw error;
  }
};

/**
 * Force refresh of Spotify data (admin only)
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
  getTopTracks,
  getTopArtists,
  refreshData
};

export default spotifyService;