import { Router, Request, Response, NextFunction } from 'express';
import { Project } from '../../db/models';
import { authenticate, authorize } from '../../middleware/auth';
import { validateProjectCreate, validateProjectUpdate } from '../../middleware/validators';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const featured = req.query.featured === 'true';
    
    // Build query
    const query = featured ? { featured: true } : {};
    
    // Execute query
    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: projects,
    });
  } catch (error) {
    logger.error(`Error fetching projects: ${error}`);
    next(error);
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    
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
  } catch (error) {
    logger.error(`Error fetching project: ${error}`);
    next(error);
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  validateProjectCreate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, technologies, image, githubUrl, liveUrl, featured } = req.body;
      
      // Create new project
      const project = await Project.create({
        title,
        description,
        technologies,
        image,
        githubUrl,
        liveUrl,
        featured: featured || false,
      });
      
      res.status(201).json({
        status: 'success',
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      logger.error(`Error creating project: ${error}`);
      next(error);
    }
  }
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  validateProjectUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Find project by ID
      const project = await Project.findById(req.params.id);
      
      if (!project) {
        return res.status(404).json({
          status: 'error',
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }
      
      // Update project
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      res.json({
        status: 'success',
        message: 'Project updated successfully',
        data: updatedProject,
      });
    } catch (error) {
      logger.error(`Error updating project: ${error}`);
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Find project by ID
      const project = await Project.findById(req.params.id);
      
      if (!project) {
        return res.status(404).json({
          status: 'error',
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }
      
      // Delete project
      await project.deleteOne();
      
      res.json({
        status: 'success',
        message: 'Project deleted successfully',
      });
    } catch (error) {
      logger.error(`Error deleting project: ${error}`);
      next(error);
    }
  }
);

export default router;