import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Mock data for now (will be replaced with database)
const projects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with MERN stack',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    image: 'https://via.placeholder.com/300',
    githubUrl: 'https://github.com/username/project',
    liveUrl: 'https://project.example.com',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A task management application with drag-and-drop interface',
    technologies: ['React', 'Redux', 'Node.js', 'PostgreSQL'],
    image: 'https://via.placeholder.com/300',
    githubUrl: 'https://github.com/username/task-app',
    liveUrl: 'https://task-app.example.com',
  },
];

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: projects,
  });
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Project not found',
    });
  }
  
  res.json({
    status: 'success',
    data: project,
  });
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', authenticate, (req, res) => {
  // In a real app, this would create a new project in the database
  res.status(201).json({
    status: 'success',
    message: 'Project created successfully',
    data: {
      id: '3',
      ...req.body,
    },
  });
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put('/:id', authenticate, (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Project not found',
    });
  }
  
  res.json({
    status: 'success',
    message: 'Project updated successfully',
    data: {
      ...project,
      ...req.body,
    },
  });
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete('/:id', authenticate, (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Project not found',
    });
  }
  
  res.json({
    status: 'success',
    message: 'Project deleted successfully',
  });
});

export default router;