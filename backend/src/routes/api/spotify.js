// File: /backend/src/routes/api/spotify.js
// Enhanced Spotify routes with user-specific data

const express = require('express');
const spotifyService = require('../../services/spotify');
const SpotifyTrack = require('../../db/models/spotifyTrack');
const User = require('../../db/models/user');
const { protect, restrictTo, checkProfileAccess } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/spotify/now-playing
 * @desc    Get current user's currently playing track
 * @access  Private
 */
router.get('/now-playing', protect, async (req, res, next) => {
  try {
    // Get currently playing track from database
    let currentTrack = await SpotifyTrack.getCurrentlyPlaying(req.user._id);
    
    // If no track is found or it's stale (>1 min old), fetch fresh data
    if (!currentTrack || !currentTrack.isCurrentlyPlaying || 
        (Date.now() - new Date(currentTrack.updatedAt).getTime() > 60000)) {
      // Force fetch new data
      await spotifyService.forceRefreshUserData(req.user._id);
      // Try to get updated track
      currentTrack = await SpotifyTrack.getCurrentlyPlaying(req.user._id);
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
    next(error);
  }
});

/**
 * @route   GET /api/spotify/recently-played
 * @desc    Get current user's recently played tracks
 * @access  Private
 */
router.get('/recently-played', protect, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    
    // Get tracks from the database
    const data = await spotifyService.getUserRecentlyPlayed(req.user._id, limit, skip);
    
    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/spotify/stats
 * @desc    Get current user's listening statistics
 * @access  Private
 */
router.get('/stats', protect, async (req, res, next) => {
  try {
    const stats = await spotifyService.getUserStats(req.user._id);
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/spotify/refresh-data
 * @desc    Force refresh of current user's Spotify data
 * @access  Private
 */
router.get('/refresh-data', protect, async (req, res, next) => {
  try {
    await spotifyService.forceRefreshUserData(req.user._id);
    
    res.status(200).json({
      status: 'success',
      message: 'Data refreshed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/spotify/top-tracks
 * @desc    Get current user's top tracks
 * @access  Private
 */
router.get('/top-tracks', protect, async (req, res, next) => {
  try {
    const timeRange = req.query.time_range || 'medium_term';
    const limit = parseInt(req.query.limit) || 10;
    
    const topTracks = await spotifyService.getUserTopTracks(req.user, timeRange, limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        topTracks
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/spotify/top-artists
 * @desc    Get current user's top artists
 * @access  Private
 */
router.get('/top-artists', protect, async (req, res, next) => {
  try {
    const timeRange = req.query.time_range || 'medium_term';
    const limit = parseInt(req.query.limit) || 10;
    
    const topArtists = await spotifyService.getUserTopArtists(req.user, timeRange, limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        topArtists
      }
    });
  } catch (error) {
    next(error);
  }
});

// User-specific routes for viewing other users' Spotify data

/**
 * @route   GET /api/spotify/users/:userId/now-playing
 * @desc    Get another user's currently playing track
 * @access  Public (with privacy checks)
 */
router.get('/users/:userId/now-playing', checkProfileAccess('userId'), async (req, res, next) => {
  try {
    // Get target user from middleware
    const targetUser = req.targetUser;
    
    // Get currently playing track from database
    const currentTrack = await SpotifyTrack.getCurrentlyPlaying(targetUser._id);
    
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
    next(error);
  }
});

/**
 * @route   GET /api/spotify/users/:userId/recently-played
 * @desc    Get another user's recently played tracks
 * @access  Public (with privacy checks)
 */
router.get('/users/:userId/recently-played', checkProfileAccess('userId'), async (req, res, next) => {
  try {
    // Get target user from middleware
    const targetUser = req.targetUser;
    
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    
    // Get tracks from the database
    const data = await spotifyService.getUserRecentlyPlayed(targetUser._id, limit, skip);
    
    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/spotify/users/:userId/stats
 * @desc    Get another user's listening statistics
 * @access  Public (with privacy checks)
 */
router.get('/users/:userId/stats', checkProfileAccess('userId'), async (req, res, next) => {
  try {
    // Get target user from middleware
    const targetUser = req.targetUser;
    
    const stats = await spotifyService.getUserStats(targetUser._id);
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;