// /backend/src/routes/api/skills.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../../middleware/auth');
const Skill = require('../../db/models/skill');

/**
 * @route   GET /api/skills
 * @desc    Get all skills
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // Parse query parameters
    const categoryFilter = req.query.category;
    const sort = req.query.sort || 'order';
    
    // Build query
    const query = categoryFilter ? { category: categoryFilter } : {};
    
    // Execute query
    const skills = await Skill.find(query).sort(sort);
    
    res.status(200).json(skills);
  })
);

/**
 * @route   GET /api/skills/categories
 * @desc    Get all skill categories
 * @access  Public
 */
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = await Skill.distinct('category');
    
    res.status(200).json(categories);
  })
);

/**
 * @route   GET /api/skills/:id
 * @desc    Get skill by ID
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      const error = new Error('Skill not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    res.status(200).json(skill);
  })
);

/**
 * @route   POST /api/skills
 * @desc    Create a new skill
 * @access  Private/Admin
 */
router.post(
  '/',
  [
    protect,
    admin,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('proficiency', 'Proficiency is required and must be between 1-100').isInt({ min: 1, max: 100 })
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
    
    // Create skill
    const skill = await Skill.create(req.body);
    
    res.status(201).json(skill);
  })
);

/**
 * @route   PUT /api/skills/:id
 * @desc    Update a skill
 * @access  Private/Admin
 */
router.put(
  '/:id',
  [
    protect,
    admin
  ],
  asyncHandler(async (req, res) => {
    // Find skill
    let skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      const error = new Error('Skill not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    // Update skill
    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(skill);
  })
);

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  [
    protect,
    admin
  ],
  asyncHandler(async (req, res) => {
    // Find skill
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      const error = new Error('Skill not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    // Delete skill
    await skill.deleteOne();
    
    res.status(200).json({
      status: 'success',
      message: 'Skill removed'
    });
  })
);

module.exports = router;