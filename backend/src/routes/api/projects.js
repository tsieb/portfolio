// /backend/src/routes/api/projects.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Project = require('../../db/models/project');
const { protect, admin } = require('../../middleware/auth');

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // Parse query parameters
    const featured = req.query.featured === 'true';
    const limit = parseInt(req.query.limit) || 0;
    const sort = req.query.sort || '-createdAt';
    
    // Build query
    const query = featured ? { featured: true } : {};
    
    // Execute query
    const projects = await Project.find(query)
      .sort(sort)
      .limit(limit);
    
    res.status(200).json(projects);
  })
);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    res.status(200).json(project);
  })
);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private/Admin
 */
router.post(
  '/',
  [
    protect,
    admin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
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
    
    // Create project
    const project = await Project.create(req.body);
    
    res.status(201).json(project);
  })
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private/Admin
 */
router.put(
  '/:id',
  [
    protect,
    admin
  ],
  asyncHandler(async (req, res) => {
    // Find project
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    // Update project
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(project);
  })
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  [
    protect,
    admin
  ],
  asyncHandler(async (req, res) => {
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    // Delete project
    await project.deleteOne();
    
    res.status(200).json({
      status: 'success',
      message: 'Project removed'
    });
  })
);

/**
 * @route   GET /api/projects/slug/:slug
 * @desc    Get project by slug
 * @access  Public
 */
router.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const project = await Project.findOne({ slug: req.params.slug });
    
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    res.status(200).json(project);
  })
);

// For development and testing - should be removed in production
if (process.env.NODE_ENV === 'development') {
  /**
   * @route   POST /api/projects/seed
   * @desc    Seed sample projects for development
   * @access  Public - only in development
   */
  router.post(
    '/seed',
    asyncHandler(async (req, res) => {
      // Sample project data
      const sampleProjects = [
        {
          title: 'Space Portfolio',
          description: 'A space-themed portfolio website with interactive elements.',
          fullDescription: 'A feature-rich portfolio website with a cosmic theme, built using React, Node.js, and MongoDB. Features include interactive orbit animations, dark mode, and an admin dashboard.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'SCSS'],
          tags: ['Frontend', 'Backend', 'Full Stack'],
          imageUrl: 'https://example.com/images/space-portfolio.jpg',
          demoUrl: 'https://space-portfolio.example.com',
          sourceUrl: 'https://github.com/example/space-portfolio',
          featured: true,
          order: 1,
          color: '#5d8eff'
        },
        {
          title: 'Weather Forecast App',
          description: 'A modern weather forecasting application with detailed analytics.',
          fullDescription: 'This weather app provides real-time forecasts, 7-day predictions, and detailed weather analytics. Built with React and uses OpenWeatherMap API for data.',
          technologies: ['React', 'Chart.js', 'OpenWeatherMap API', 'CSS'],
          tags: ['Frontend', 'API Integration'],
          imageUrl: 'https://example.com/images/weather-app.jpg',
          demoUrl: 'https://weather.example.com',
          sourceUrl: 'https://github.com/example/weather-app',
          featured: true,
          order: 2,
          color: '#4ecdc4'
        },
        {
          title: 'Task Management System',
          description: 'A comprehensive task management system with team collaboration features.',
          fullDescription: 'A full-stack task management application that enables teams to organize workflows, track progress, and collaborate effectively. Features include drag-and-drop task boards, file attachments, and real-time notifications.',
          technologies: ['React', 'Redux', 'Node.js', 'Socket.io', 'PostgreSQL'],
          tags: ['Frontend', 'Backend', 'Full Stack'],
          imageUrl: 'https://example.com/images/task-manager.jpg',
          demoUrl: 'https://tasks.example.com',
          sourceUrl: 'https://github.com/example/task-manager',
          featured: true,
          order: 3,
          color: '#ff6b6b'
        },
        {
          title: 'E-commerce Platform',
          description: 'A feature-rich e-commerce platform with payment processing integration.',
          fullDescription: 'A complete e-commerce solution with product catalog, shopping cart, user accounts, order management, and payment processing via Stripe. The admin dashboard provides inventory management and sales analytics.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
          tags: ['Frontend', 'Backend', 'Full Stack', 'E-commerce'],
          imageUrl: 'https://example.com/images/ecommerce.jpg',
          demoUrl: 'https://shop.example.com',
          sourceUrl: 'https://github.com/example/ecommerce',
          featured: true,
          order: 4,
          color: '#9b59b6'
        },
        {
          title: 'Social Media Dashboard',
          description: 'A unified dashboard for managing multiple social media accounts.',
          fullDescription: 'A centralized dashboard for managing and analyzing multiple social media accounts across different platforms. Includes scheduling capabilities, engagement analytics, and content performance tracking.',
          technologies: ['React', 'Node.js', 'GraphQL', 'Various Social Media APIs'],
          tags: ['Frontend', 'Backend', 'API Integration'],
          imageUrl: 'https://example.com/images/social-dashboard.jpg',
          demoUrl: 'https://social.example.com',
          sourceUrl: 'https://github.com/example/social-dashboard',
          featured: false,
          order: 5,
          color: '#3498db'
        }
      ];
      
      // Clear existing projects
      await Project.deleteMany({});
      
      // Insert sample projects
      const projects = await Project.insertMany(sampleProjects);
      
      res.status(201).json({
        status: 'success',
        message: `${projects.length} sample projects created`,
        data: projects
      });
    })
  );
}

module.exports = router;