// File: /backend/src/services/spotify.js
// Enhanced Spotify service with user-specific functionality

const axios = require('axios');
const SpotifyTrack = require('../db/models/spotifyTrack');
const User = require('../db/models/user');

// Spotify API URLs
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Store token data in memory
let spotifyTokenData = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null
};

/**
 * Get client credentials for Spotify API
 * @returns {string} Base64 encoded client credentials
 */
const getSpotifyClientCredentials = () => {
  const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  return Buffer.from(credentials).toString('base64');
};

/**
 * Refresh the Spotify access token using the refresh token
 * @param {string} refreshToken - Refresh token to use (defaults to admin token)
 * @returns {Promise<string>} New access token
 */
const refreshSpotifyToken = async (refreshToken = process.env.SPOTIFY_REFRESH_TOKEN) => {
  try {
    // Use the refresh token to get a new access token
    const response = await axios({
      method: 'post',
      url: SPOTIFY_TOKEN_URL,
      headers: {
        'Authorization': `Basic ${getSpotifyClientCredentials()}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    // If using the admin token, update the global token data
    if (refreshToken === process.env.SPOTIFY_REFRESH_TOKEN) {
      spotifyTokenData = {
        accessToken: response.data.access_token,
        refreshToken,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000)
      };
    }

    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing Spotify token:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a valid Spotify access token
 * @param {string} refreshToken - Optional refresh token to use
 * @returns {Promise<string>} Valid access token
 */
const getSpotifyToken = async (refreshToken = null) => {
  // If a specific refresh token is provided, refresh and return a token
  if (refreshToken) {
    return await refreshSpotifyToken(refreshToken);
  }
  
  // Otherwise use the default admin token
  if (
    spotifyTokenData.accessToken && 
    spotifyTokenData.expiresAt && 
    new Date() < spotifyTokenData.expiresAt
  ) {
    return spotifyTokenData.accessToken;
  }

  return await refreshSpotifyToken();
};

/**
 * Initialize the Spotify service
 * - Get initial access token
 * - Set up periodic token refresh
 * - Set up periodic currently playing check for all active users
 * @returns {Promise<void>}
 */
const initializeSpotifyService = async () => {
  try {
    // Get initial token
    await getSpotifyToken();
    
    // Set up interval to refresh token every 50 minutes (tokens expire after 1 hour)
    setInterval(async () => {
      try {
        await refreshSpotifyToken();
      } catch (error) {
        console.error('Error in token refresh interval:', error);
      }
    }, 50 * 60 * 1000); // 50 minutes
    
    // Set up interval to check currently playing for all active users
    setInterval(async () => {
      try {
        await updateAllUsersCurrentlyPlaying();
      } catch (error) {
        console.error('Error in currently playing interval:', error);
      }
    }, 60 * 1000); // 60 seconds
    
    // Initial check
    await updateAllUsersCurrentlyPlaying();
    
    console.log('Spotify service initialized successfully');
  } catch (error) {
    console.error('Error initializing Spotify service:', error);
    throw error;
  }
};

/**
 * Make an authenticated request to the Spotify API
 * @param {string} endpoint - API endpoint
 * @param {string} accessToken - User-specific access token
 * @param {string} method - HTTP method
 * @param {Object} [params={}] - Query parameters
 * @returns {Promise<Object>} API response data
 */
const spotifyApiRequest = async (endpoint, accessToken, method = 'get', params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${SPOTIFY_API_BASE}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params
    });
    
    return response.data;
  } catch (error) {
    // Handle token expiration
    if (error.response?.status === 401) {
      throw new Error('Spotify token expired');
    }
    
    console.error('Spotify API request error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get Spotify user profile
 * @param {string} accessToken - Access token for the user
 * @returns {Promise<Object>} User profile
 */
const getUserProfile = async (accessToken) => {
  try {
    return await spotifyApiRequest('/me', accessToken);
  } catch (error) {
    console.error('Error fetching Spotify user profile:', error);
    throw error;
  }
};

/**
 * Update currently playing track for a specific user
 * @param {Object} user - User object with Spotify tokens
 * @returns {Promise<Object|null>} Currently playing track or null
 */
const updateUserCurrentlyPlaying = async (user) => {
  if (!user.spotifyConnected || !user.spotifyToken?.refreshToken) {
    return null;
  }
  
  try {
    // Get a fresh access token
    let accessToken;
    try {
      if (new Date() >= new Date(user.spotifyToken.expiresAt)) {
        accessToken = await refreshSpotifyToken(user.spotifyToken.refreshToken);
        
        // Update user token in database
        user.spotifyToken.accessToken = accessToken;
        user.spotifyToken.expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
        await user.save({ validateBeforeSave: false });
      } else {
        accessToken = user.spotifyToken.accessToken;
      }
    } catch (error) {
      console.error(`Error refreshing token for user ${user._id}:`, error);
      return null;
    }
    
    // Fetch currently playing
    const data = await spotifyApiRequest('/me/player/currently-playing', accessToken);
    
    // If no track is playing
    if (!data || !data.is_playing || !data.item) {
      // Reset all tracks to not currently playing
      await SpotifyTrack.updateMany(
        { user: user._id, isCurrentlyPlaying: true },
        { isCurrentlyPlaying: false }
      );
      return null;
    }
    
    const track = data.item;
    const artists = track.artists.map(artist => artist.name).join(', ');
    
    // Reset all tracks to not currently playing
    await SpotifyTrack.updateMany(
      { user: user._id, isCurrentlyPlaying: true },
      { isCurrentlyPlaying: false }
    );
    
    // Find if we already have this track in our history
    const existingTrack = await SpotifyTrack.findOne({
      user: user._id,
      trackId: track.id,
      // Only consider it the same "listen" if it was started in the last 10 minutes
      playedAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
    });
    
    let savedTrack;
    
    if (existingTrack) {
      // Update existing track
      savedTrack = await SpotifyTrack.findByIdAndUpdate(
        existingTrack._id,
        {
          isCurrentlyPlaying: true,
          // Update other fields that might have changed
          popularity: track.popularity,
          // Don't update playedAt to keep the original timestamp
        },
        { new: true }
      );
    } else {
      // Create new track record
      savedTrack = await SpotifyTrack.create({
        user: user._id,
        trackId: track.id,
        trackName: track.name,
        artistName: artists,
        albumName: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        duration: track.duration_ms,
        popularity: track.popularity,
        previewUrl: track.preview_url,
        playedAt: new Date(),
        isCurrentlyPlaying: true,
        // Additional metadata
        trackUri: track.uri,
        trackUrl: track.external_urls.spotify,
        artistId: track.artists[0]?.id,
        artistUrl: track.artists[0]?.external_urls.spotify,
        albumId: track.album.id,
        albumUrl: track.album.external_urls.spotify,
        albumReleaseDate: track.album.release_date
      });
      
      // Fetch and add genres for the track's artist
      try {
        if (track.artists[0]?.id) {
          const artistData = await spotifyApiRequest(`/artists/${track.artists[0].id}`, accessToken);
          if (artistData && artistData.genres) {
            savedTrack.genres = artistData.genres;
            await savedTrack.save();
          }
        }
      } catch (error) {
        console.error('Error fetching artist genres:', error);
        // Continue even if genre fetch fails
      }
    }
    
    return savedTrack;
  } catch (error) {
    console.error(`Error fetching currently playing for user ${user._id}:`, error);
    return null;
  }
};

/**
 * Update currently playing tracks for all active users
 * @returns {Promise<void>}
 */
const updateAllUsersCurrentlyPlaying = async () => {
  try {
    // Find users who have connected Spotify accounts
    // Only process users who have been active in the last day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const users = await User.find({
      spotifyConnected: true,
      'spotifyToken.refreshToken': { $exists: true },
      lastActive: { $gte: oneDayAgo }
    });
    
    console.log(`Updating currently playing for ${users.length} active users`);
    
    // Update each user in parallel
    await Promise.all(users.map(async (user) => {
      try {
        await updateUserCurrentlyPlaying(user);
      } catch (error) {
        console.error(`Error updating user ${user._id}:`, error);
      }
    }));
  } catch (error) {
    console.error('Error updating all users currently playing:', error);
  }
};

/**
 * Get recently played tracks for a specific user
 * @param {string} userId - User ID
 * @param {number} limit - Number of tracks to retrieve
 * @param {number} skip - Number of tracks to skip
 * @returns {Promise<Object>} Recently played tracks with pagination
 */
const getUserRecentlyPlayed = async (userId, limit = 10, skip = 0) => {
  try {
    const tracks = await SpotifyTrack.getHistory(userId, limit, skip);
    const total = await SpotifyTrack.countDocuments({ user: userId });
    
    return {
      tracks,
      pagination: {
        page: Math.floor(skip / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error(`Error fetching recently played for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get statistics for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
const getUserStats = async (userId) => {
  try {
    return await SpotifyTrack.getStatistics(userId);
  } catch (error) {
    console.error(`Error fetching stats for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get a user's top tracks via Spotify API
 * @param {Object} user - User object with Spotify tokens
 * @param {string} timeRange - Time range: short_term, medium_term, long_term
 * @param {number} limit - Number of tracks to retrieve
 * @returns {Promise<Array>} Top tracks
 */
const getUserTopTracks = async (user, timeRange = 'medium_term', limit = 10) => {
  if (!user.spotifyConnected || !user.spotifyToken?.refreshToken) {
    throw new Error('User is not connected to Spotify');
  }
  
  try {
    // Get a fresh access token if needed
    let accessToken;
    if (new Date() >= new Date(user.spotifyToken.expiresAt)) {
      accessToken = await refreshSpotifyToken(user.spotifyToken.refreshToken);
      
      // Update user token in database
      user.spotifyToken.accessToken = accessToken;
      user.spotifyToken.expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
      await user.save({ validateBeforeSave: false });
    } else {
      accessToken = user.spotifyToken.accessToken;
    }
    
    const data = await spotifyApiRequest('/me/top/tracks', accessToken, 'get', {
      time_range: timeRange,
      limit
    });
    
    return data.items.map(track => ({
      trackId: track.id,
      trackName: track.name,
      artistName: track.artists.map(artist => artist.name).join(', '),
      albumName: track.album.name,
      albumImageUrl: track.album.images[0]?.url,
      popularity: track.popularity,
      duration: track.duration_ms,
      trackUrl: track.external_urls.spotify
    }));
  } catch (error) {
    console.error(`Error fetching top tracks for user ${user._id}:`, error);
    throw error;
  }
};

/**
 * Get a user's top artists via Spotify API
 * @param {Object} user - User object with Spotify tokens
 * @param {string} timeRange - Time range: short_term, medium_term, long_term
 * @param {number} limit - Number of artists to retrieve
 * @returns {Promise<Array>} Top artists
 */
const getUserTopArtists = async (user, timeRange = 'medium_term', limit = 10) => {
  if (!user.spotifyConnected || !user.spotifyToken?.refreshToken) {
    throw new Error('User is not connected to Spotify');
  }
  
  try {
    // Get a fresh access token if needed
    let accessToken;
    if (new Date() >= new Date(user.spotifyToken.expiresAt)) {
      accessToken = await refreshSpotifyToken(user.spotifyToken.refreshToken);
      
      // Update user token in database
      user.spotifyToken.accessToken = accessToken;
      user.spotifyToken.expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
      await user.save({ validateBeforeSave: false });
    } else {
      accessToken = user.spotifyToken.accessToken;
    }
    
    const data = await spotifyApiRequest('/me/top/artists', accessToken, 'get', {
      time_range: timeRange,
      limit
    });
    
    return data.items.map(artist => ({
      artistId: artist.id,
      artistName: artist.name,
      artistImageUrl: artist.images[0]?.url,
      genres: artist.genres,
      popularity: artist.popularity,
      artistUrl: artist.external_urls.spotify
    }));
  } catch (error) {
    console.error(`Error fetching top artists for user ${user._id}:`, error);
    throw error;
  }
};

/**
 * Force refresh of a user's currently playing track
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Updated track or null
 */
const forceRefreshUserData = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.spotifyConnected) {
      throw new Error('User not found or not connected to Spotify');
    }
    
    return await updateUserCurrentlyPlaying(user);
  } catch (error) {
    console.error(`Error refreshing data for user ${userId}:`, error);
    throw error;
  }
};

module.exports = {
  initializeSpotifyService,
  getSpotifyToken,
  refreshSpotifyToken,
  getUserProfile,
  updateUserCurrentlyPlaying,
  updateAllUsersCurrentlyPlaying,
  getUserRecentlyPlayed,
  getUserStats,
  getUserTopTracks,
  getUserTopArtists,
  forceRefreshUserData
};