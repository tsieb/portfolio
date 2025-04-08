// /backend/src/routes/api/contact.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../../middleware/auth');
const Message = require('../../db/models/message');

/**
 * @route   POST /api/contact
 * @desc    Send a contact message
 * @access  Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty().isLength({ min: 10 })
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation Error',
        details: errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    
    // Create message
    const message = await Message.create(req.body);
    
    // In a real app, you would send an email notification here
    
    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent'
    });
  })
);

/**
 * @route   GET /api/contact/messages
 * @desc    Get all contact messages
 * @access  Private/Admin
 */
router.get(
  '/messages',
  [
    protect,
    admin
  ],
  asyncHandler(async (req, res) => {
    // Parse query parameters
    const limit = parseInt(req.query.limit) || 0;
    const page = parseInt(req.query.page) || 1;
    const status = req.query.status;
    const sort = req.query.sort || '-createdAt';
    
    // Build query
    const query = status ? { status } : {};
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Count total documents for pagination
    const total = await Message.countDocuments(query);
    
    // Execute query
    const messages = await Message.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      status: 'success',
      count: messages.length,
      total,
      page,
      totalPages: limit ? Math.ceil(total / limit) : 1,
      data: messages
    });
  })
);

/**
 * @route   GET /api/contact/messages/:id
 * @desc    Get message by ID
 * @access  Private/Admin
 */
router.get(
  '/messages/:id',
  [
    protect,
    admin
  ],
  asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      const error = new Error('Message not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({
      status: 'success',
      data: message
    });
  })
);

/**
 * @route   PUT /api/contact/messages/:id
 * @desc    Update message status
 * @access  Private/Admin
 */
router.put(
  '/messages/:id',
  [
    protect,
    admin,
    [
      check('status', 'Status is required').isIn(['new', 'read', 'replied', 'archived'])
    ]
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation Error',
        details: errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    
    // Find message
    let message = await Message.findById(req.params.id);
    
    if (!message) {
      const error = new Error('Message not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    // Update message status
    message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: message
    });
  })
);

/**
 * @route   DELETE /api/contact/messages/:id
 * @desc    Delete a message
 * @access  Private/Admin
 */
router.delete(
  '/messages/:id',
  [
    protect,
    admin
  ],
  asyncHandler(async (req, res) => {
    // Find message
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      const error = new Error('Message not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    // Delete message
    await message.deleteOne();
    
    res.status(200).json({
      status: 'success',
      message: 'Message removed'
    });
  })
);

module.exports = router;