// File: /backend/src/routes/api/settings.js
// Public application settings routes

const express = require('express');
const AppSetting = require('../../db/models/appSetting');

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get public application settings
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const settings = await AppSetting.getPublicSettings();
    
    res.status(200).json({
      status: 'success',
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;