import { Router, Request, Response, NextFunction } from 'express';
import { Portfolio } from '../../db/models';
import { authenticate, authorize } from '../../middleware/auth';
import { validatePortfolio } from '../../middleware/validators';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * @route   GET /api/portfolio
 * @desc    Get portfolio data
 * @access  Public
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the most recent portfolio data
    const portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    
    if (!portfolio) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Portfolio data not found',
      });
    }
    
    res.json({
      status: 'success',
      data: portfolio,
    });
  } catch (error) {
    logger.error(`Error fetching portfolio: ${error}`);
    next(error);
  }
});

/**
 * @route   POST /api/portfolio
 * @desc    Create portfolio data
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  validatePortfolio,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create new portfolio
      const portfolio = await Portfolio.create(req.body);
      
      res.status(201).json({
        status: 'success',
        message: 'Portfolio created successfully',
        data: portfolio,
      });
    } catch (error) {
      logger.error(`Error creating portfolio: ${error}`);
      next(error);
    }
  }
);

/**
 * @route   PUT /api/portfolio/:id
 * @desc    Update portfolio data
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  validatePortfolio,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Find portfolio by ID
      const portfolio = await Portfolio.findById(req.params.id);
      
      if (!portfolio) {
        return res.status(404).json({
          status: 'error',
          code: 'NOT_FOUND',
          message: 'Portfolio not found',
        });
      }
      
      // Update portfolio
      const updatedPortfolio = await Portfolio.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      res.json({
        status: 'success',
        message: 'Portfolio updated successfully',
        data: updatedPortfolio,
      });
    } catch (error) {
      logger.error(`Error updating portfolio: ${error}`);
      next(error);
    }
  }
);

export default router;