// File: /backend/src/routes/api/admin.js
// Admin routes

const express = require('express');
const SpotifyTrack = require('../../db/models/spotifyTrack');
const User = require('../../db/models/user');
const { protect, restrictTo } = require('../../middleware/auth');

const router = express.Router();

// All routes in this file are protected and require admin role
router.use(protect);
router.use(restrictTo('admin'));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard data
 * @access  Private/Admin
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Get listening statistics
    const listeningStats = await SpotifyTrack.getStatistics();
    
    // Get user count
    const userCount = await User.countDocuments();
    
    // Get recent tracks with pagination
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const recentTracks = await SpotifyTrack.getHistory(limit, skip);
    
    // Get total track count
    const trackCount = await SpotifyTrack.countDocuments();
    
    // Get listening trends (tracks per day for the last 14 days)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const listeningTrends = await SpotifyTrack.aggregate([
      { 
        $match: { 
          playedAt: { $gte: twoWeeksAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$playedAt' } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        listeningStats,
        userCount,
        recentTracks,
        trackCount,
        listeningTrends
      }
    });
  } catch (error) {
    console.error('Error in admin dashboard route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching admin dashboard data'
    });
  }
});

/**
 * @route   GET /api/admin/tracks
 * @desc    Get all tracks with pagination, sorting, and filtering
 * @access  Private/Admin
 */
router.get('/tracks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const sortField = req.query.sort || 'playedAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    
    // Build filter object from query parameters
    const filter = {};
    
    if (req.query.artist) {
      filter.artistName = { $regex: req.query.artist, $options: 'i' };
    }
    
    if (req.query.track) {
      filter.trackName = { $regex: req.query.track, $options: 'i' };
    }
    
    if (req.query.album) {
      filter.albumName = { $regex: req.query.album, $options: 'i' };
    }
    
    if (req.query.startDate) {
      if (!filter.playedAt) filter.playedAt = {};
      filter.playedAt.$gte = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      if (!filter.playedAt) filter.playedAt = {};
      filter.playedAt.$lte = new Date(req.query.endDate);
    }
    
    // Execute query with pagination and sorting
    const tracks = await SpotifyTrack
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination info
    const total = await SpotifyTrack.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      data: {
        tracks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error in admin tracks route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tracks'
    });
  }
});

/**
 * @route   DELETE /api/admin/tracks/:id
 * @desc    Delete a track by ID
 * @access  Private/Admin
 */
router.delete('/tracks/:id', async (req, res) => {
  try {
    const track = await SpotifyTrack.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({
        status: 'error',
        message: 'Track not found'
      });
    }
    
    await SpotifyTrack.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Track deleted successfully'
    });
  } catch (error) {
    console.error('Error in delete track route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting track'
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Error in admin users route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching users'
    });
  }
});

module.exports = router;