// File: /backend/src/services/spotify.js
// Spotify integration service

const axios = require('axios');
const SpotifyTrack = require('../db/models/spotifyTrack');

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
 * @returns {Promise<string>} New access token
 */
const refreshSpotifyToken = async () => {
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
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
      })
    });

    // Update token data
    spotifyTokenData = {
      accessToken: response.data.access_token,
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
      expiresAt: new Date(Date.now() + response.data.expires_in * 1000)
    };

    console.log('Spotify token refreshed successfully');
    return spotifyTokenData.accessToken;
  } catch (error) {
    console.error('Error refreshing Spotify token:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a valid Spotify access token
 * @returns {Promise<string>} Valid access token
 */
const getSpotifyToken = async () => {
  // If token exists and is not expired, return it
  if (
    spotifyTokenData.accessToken && 
    spotifyTokenData.expiresAt && 
    new Date() < spotifyTokenData.expiresAt
  ) {
    return spotifyTokenData.accessToken;
  }

  // Otherwise, refresh the token
  return await refreshSpotifyToken();
};

/**
 * Initialize the Spotify service
 * - Get initial access token
 * - Set up periodic token refresh
 * - Set up periodic currently playing check
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
    
    // Set up interval to check currently playing
    setInterval(async () => {
      try {
        await fetchCurrentlyPlaying();
      } catch (error) {
        console.error('Error in currently playing interval:', error);
      }
    }, 30 * 1000); // 30 seconds
    
    // Initial fetch of currently playing
    await fetchCurrentlyPlaying();
    
    console.log('Spotify service initialized successfully');
  } catch (error) {
    console.error('Error initializing Spotify service:', error);
    throw error;
  }
};

/**
 * Make an authenticated request to the Spotify API
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} [params={}] - Query parameters
 * @returns {Promise<Object>} API response data
 */
const spotifyApiRequest = async (endpoint, method = 'get', params = {}) => {
  try {
    const token = await getSpotifyToken();
    
    const response = await axios({
      method,
      url: `${SPOTIFY_API_BASE}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params
    });
    
    return response.data;
  } catch (error) {
    // If token is expired, refresh and try again
    if (error.response && error.response.status === 401) {
      await refreshSpotifyToken();
      return spotifyApiRequest(endpoint, method, params);
    }
    
    console.error('Spotify API request error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch the user's currently playing track
 * @returns {Promise<Object|null>} Currently playing track or null
 */
const fetchCurrentlyPlaying = async () => {
  try {
    const data = await spotifyApiRequest('/me/player/currently-playing');
    
    // If no track is playing
    if (!data || !data.is_playing || !data.item) {
      // Reset all tracks to not currently playing
      await SpotifyTrack.updateMany(
        { isCurrentlyPlaying: true },
        { isCurrentlyPlaying: false }
      );
      return null;
    }
    
    const track = data.item;
    const artists = track.artists.map(artist => artist.name).join(', ');
    
    // Reset all tracks to not currently playing
    await SpotifyTrack.updateMany(
      { isCurrentlyPlaying: true },
      { isCurrentlyPlaying: false }
    );
    
    // Find if we already have this track in our history
    const existingTrack = await SpotifyTrack.findOne({
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
          const artistData = await spotifyApiRequest(`/artists/${track.artists[0].id}`);
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
    console.error('Error fetching currently playing:', error);
    return null;
  }
};

/**
 * Get the user's recently played tracks
 * @param {number} limit - Number of tracks to retrieve
 * @returns {Promise<Array>} Recently played tracks
 */
const getRecentlyPlayed = async (limit = 20) => {
  try {
    const data = await spotifyApiRequest('/me/player/recently-played', 'get', {
      limit
    });
    
    return data.items.map(item => ({
      trackId: item.track.id,
      trackName: item.track.name,
      artistName: item.track.artists.map(artist => artist.name).join(', '),
      albumName: item.track.album.name,
      albumImageUrl: item.track.album.images[0]?.url,
      playedAt: new Date(item.played_at),
      duration: item.track.duration_ms
    }));
  } catch (error) {
    console.error('Error fetching recently played:', error);
    throw error;
  }
};

/**
 * Get the user's top tracks
 * @param {string} timeRange - Time range: short_term, medium_term, long_term
 * @param {number} limit - Number of tracks to retrieve
 * @returns {Promise<Array>} Top tracks
 */
const getTopTracks = async (timeRange = 'medium_term', limit = 10) => {
  try {
    const data = await spotifyApiRequest('/me/top/tracks', 'get', {
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
      duration: track.duration_ms
    }));
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
};

/**
 * Get the user's top artists
 * @param {string} timeRange - Time range: short_term, medium_term, long_term
 * @param {number} limit - Number of artists to retrieve
 * @returns {Promise<Array>} Top artists
 */
const getTopArtists = async (timeRange = 'medium_term', limit = 10) => {
  try {
    const data = await spotifyApiRequest('/me/top/artists', 'get', {
      time_range: timeRange,
      limit
    });
    
    return data.items.map(artist => ({
      artistId: artist.id,
      artistName: artist.name,
      artistImageUrl: artist.images[0]?.url,
      genres: artist.genres,
      popularity: artist.popularity
    }));
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
};

module.exports = {
  initializeSpotifyService,
  getSpotifyToken,
  refreshSpotifyToken,
  fetchCurrentlyPlaying,
  getRecentlyPlayed,
  getTopTracks,
  getTopArtists
};