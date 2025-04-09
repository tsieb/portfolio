// File: /backend/src/routes/api/notifications.js
// Notification routes for user notifications

const express = require('express');
const UserNotification = require('../../db/models/userNotification');
const { protect } = require('../../middleware/auth');
const { AppError } = require('../../middleware/error');

const router = express.Router();

// Protect all notification routes
router.use(protect);

/**
 * @route   GET /api/notifications
 * @desc    Get current user's notifications
 * @access  Private
 */
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unread === 'true';
    
    // Build query
    const query = { recipient: req.user._id };
    if (unreadOnly) {
      query.read = false;
    }
    
    // Execute query with pagination
    const notifications = await UserNotification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', '_id username displayName avatar');
    
    // Get total count
    const total = await UserNotification.countDocuments(query);
    
    // Get unread count
    const unreadCount = await UserNotification.countDocuments({
      recipient: req.user._id,
      read: false
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await UserNotification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', async (req, res, next) => {
  try {
    await UserNotification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const notification = await UserNotification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });
    
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/notifications
 * @desc    Delete all notifications
 * @access  Private
 */
router.delete('/', async (req, res, next) => {
  try {
    await UserNotification.deleteMany({ recipient: req.user._id });
    
    res.status(200).json({
      status: 'success',
      message: 'All notifications deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;