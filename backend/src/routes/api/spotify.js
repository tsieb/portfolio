// File: /backend/src/routes/api/spotify.js
// Spotify data routes

const express = require('express');
const spotifyService = require('../../services/spotify');
const SpotifyTrack = require('../../db/models/spotifyTrack');
const { protect, restrictTo } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/spotify/now-playing
 * @desc    Get currently playing track
 * @access  Public
 */
router.get('/now-playing', async (req, res) => {
  try {
    // First try to get from database
    let currentTrack = await SpotifyTrack.getCurrentlyPlaying();
    
    // If no track is found or it's stale (>1 min old), fetch fresh data
    if (!currentTrack || !currentTrack.isCurrentlyPlaying || 
        (Date.now() - new Date(currentTrack.updatedAt).getTime() > 60000)) {
      // Force fetch new data
      await spotifyService.fetchCurrentlyPlaying();
      // Try to get updated track
      currentTrack = await SpotifyTrack.getCurrentlyPlaying();
    }
    
    if (!currentTrack) {
      return res.status(200).json({
        status: 'success',
        data: {
          isPlaying: false
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        isPlaying: true,
        track: currentTrack
      }
    });
  } catch (error) {
    console.error('Error in now-playing route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching currently playing track'
    });
  }
});

/**
 * @route   GET /api/spotify/recently-played
 * @desc    Get recently played tracks
 * @access  Public
 */
router.get('/recently-played', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    
    // Get tracks from the database
    const tracks = await SpotifyTrack.getHistory(limit, skip);
    
    res.status(200).json({
      status: 'success',
      data: {
        tracks
      }
    });
  } catch (error) {
    console.error('Error in recently-played route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching recently played tracks'
    });
  }
});

/**
 * @route   GET /api/spotify/stats
 * @desc    Get listening statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await SpotifyTrack.getStatistics();
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Error in stats route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics'
    });
  }
});

/**
 * @route   GET /api/spotify/top-tracks
 * @desc    Get user's top tracks
 * @access  Private/Admin
 */
router.get('/top-tracks', protect, restrictTo('admin'), async (req, res) => {
  try {
    const timeRange = req.query.time_range || 'medium_term';
    const limit = parseInt(req.query.limit) || 10;
    
    const topTracks = await spotifyService.getTopTracks(timeRange, limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        topTracks
      }
    });
  } catch (error) {
    console.error('Error in top-tracks route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching top tracks'
    });
  }
});

/**
 * @route   GET /api/spotify/top-artists
 * @desc    Get user's top artists
 * @access  Private/Admin
 */
router.get('/top-artists', protect, restrictTo('admin'), async (req, res) => {
  try {
    const timeRange = req.query.time_range || 'medium_term';
    const limit = parseInt(req.query.limit) || 10;
    
    const topArtists = await spotifyService.getTopArtists(timeRange, limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        topArtists
      }
    });
  } catch (error) {
    console.error('Error in top-artists route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching top artists'
    });
  }
});

/**
 * @route   GET /api/spotify/refresh-data
 * @desc    Force refresh of currently playing
 * @access  Private/Admin
 */
router.get('/refresh-data', protect, restrictTo('admin'), async (req, res) => {
  try {
    await spotifyService.fetchCurrentlyPlaying();
    
    res.status(200).json({
      status: 'success',
      message: 'Data refreshed successfully'
    });
  } catch (error) {
    console.error('Error in refresh-data route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error refreshing data'
    });
  }
});

module.exports = router;