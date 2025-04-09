// File: /backend/src/routes/api/users.js
// User profile and privacy management routes

const express = require('express');
const userService = require('../../services/user');
const { protect, checkProfileAccess, checkOwnership } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/users/search
 * @desc    Search for users
 * @access  Public
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    const currentUser = req.user; // Will be undefined for non-authenticated requests
    
    const users = await userService.searchUsers(q, parseInt(limit), currentUser);
    
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:username
 * @desc    Get user profile by username
 * @access  Public (with privacy checks)
 */
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const currentUser = req.user; // Will be undefined for non-authenticated requests
    
    const profile = await userService.getUserProfile(username, currentUser);
    
    res.status(200).json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user._id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/privacy
 * @desc    Update privacy settings
 * @access  Private
 */
router.put('/privacy', protect, async (req, res, next) => {
  try {
    const user = await userService.updatePrivacySettings(req.user._id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/allowed-viewers
 * @desc    Get list of allowed viewers
 * @access  Private
 */
router.get('/allowed-viewers', protect, async (req, res, next) => {
  try {
    const viewers = await userService.getAllowedViewers(req.user._id);
    
    res.status(200).json({
      status: 'success',
      data: viewers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/users/allowed-viewers
 * @desc    Add allowed viewer
 * @access  Private
 */
router.post('/allowed-viewers', protect, async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }
    
    const viewers = await userService.addAllowedViewer(req.user._id, userId);
    
    res.status(200).json({
      status: 'success',
      data: viewers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/users/allowed-viewers/:userId
 * @desc    Remove allowed viewer
 * @access  Private
 */
router.delete('/allowed-viewers/:userId', protect, async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const viewers = await userService.removeAllowedViewer(req.user._id, userId);
    
    res.status(200).json({
      status: 'success',
      data: viewers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/users/:userId/follow
 * @desc    Follow a user
 * @access  Private
 */
router.post('/:userId/follow', protect, async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const follow = await userService.followUser(req.user._id, userId);
    
    res.status(200).json({
      status: 'success',
      data: follow
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/users/:userId/follow
 * @desc    Unfollow a user
 * @access  Private
 */
router.delete('/:userId/follow', protect, async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    await userService.unfollowUser(req.user._id, userId);
    
    res.status(200).json({
      status: 'success',
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:userId/followers
 * @desc    Get user's followers
 * @access  Public (with privacy checks)
 */
router.get('/:userId/followers', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const followers = await userService.getUserFollowers(userId, parseInt(limit), skip);
    
    res.status(200).json({
      status: 'success',
      data: followers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:userId/following
 * @desc    Get users the user is following
 * @access  Public (with privacy checks)
 */
router.get('/:userId/following', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const following = await userService.getUserFollowing(userId, parseInt(limit), skip);
    
    res.status(200).json({
      status: 'success',
      data: following
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;