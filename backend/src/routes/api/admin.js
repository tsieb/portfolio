// File: /backend/src/routes/api/admin.js
// Admin routes for user and data management

const express = require('express');
const adminService = require('../../services/admin');
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
router.get('/dashboard', async (req, res, next) => {
  try {
    const data = await adminService.getDashboardData();
    
    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Private/Admin
 */
router.get('/users', async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || '',
      sort: req.query.sort || 'createdAt',
      order: req.query.order || 'desc',
      onlySpotifyConnected: req.query.onlySpotifyConnected === 'true'
    };
    
    const data = await adminService.getUsers(options);
    
    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/users/:id', async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/users/:id', async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/admin/users/create
 * @desc    Create test user
 * @access  Private/Admin
 */
router.post('/users/create', async (req, res, next) => {
  try {
    const user = await adminService.createTestUser(req.body);
    
    res.status(201).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/tracks
 * @desc    Get all tracks with pagination, filtering, and sorting
 * @access  Private/Admin
 */
router.get('/tracks', async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sort: req.query.sort || 'playedAt',
      order: req.query.order || 'desc',
      artist: req.query.artist || '',
      track: req.query.track || '',
      album: req.query.album || '',
      userId: req.query.userId || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null
    };
    
    const data = await adminService.getTracks(options);
    
    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/admin/tracks/:id
 * @desc    Delete track
 * @access  Private/Admin
 */
router.delete('/tracks/:id', async (req, res, next) => {
  try {
    await adminService.deleteTrack(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Track deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/settings
 * @desc    Get application settings
 * @access  Private/Admin
 */
router.get('/settings', async (req, res, next) => {
  try {
    const settings = await adminService.getAppSettings();
    
    res.status(200).json({
      status: 'success',
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/admin/settings
 * @desc    Update application settings
 * @access  Private/Admin
 */
router.put('/settings', async (req, res, next) => {
  try {
    const settings = await adminService.updateAppSettings(req.body);
    
    res.status(200).json({
      status: 'success',
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/admin/login
 * @desc    Admin login with email and password
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.role !== 'admin' || !(await user.correctPassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;