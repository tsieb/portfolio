import { Router, Request, Response, NextFunction } from 'express';
import { Message } from '../../db/models';
import { authenticate, authorize } from '../../middleware/auth';
import { validateContact } from '../../middleware/validators';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * @route   POST /api/contact
 * @desc    Send a contact message
 * @access  Public
 */
router.post('/', validateContact, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Create new message
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'No Subject',
      message,
      read: false,
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    logger.error(`Error sending message: ${error}`);
    next(error);
  }
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 * @access  Private (Admin only)
 */
router.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: messages,
    });
  } catch (error) {
    logger.error(`Error fetching messages: ${error}`);
    next(error);
  }
});

/**
 * @route   GET /api/contact/:id
 * @desc    Get contact message by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Message not found',
      });
    }
    
    res.json({
      status: 'success',
      data: message,
    });
  } catch (error) {
    logger.error(`Error fetching message: ${error}`);
    next(error);
  }
});

/**
 * @route   PUT /api/contact/:id
 * @desc    Mark message as read
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find message by ID
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Message not found',
      });
    }
    
    // Update message read status
    message.read = true;
    await message.save();
    
    res.json({
      status: 'success',
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    logger.error(`Error updating message: ${error}`);
    next(error);
  }
});

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete a message
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find message by ID
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Message not found',
      });
    }
    
    // Delete message
    await message.deleteOne();
    
    res.json({
      status: 'success',
      message: 'Message deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting message: ${error}`);
    next(error);
  }
});

export default router;