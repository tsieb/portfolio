import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Mock messages array
const messages: any[] = [];

/**
 * @route   POST /api/contact
 * @desc    Send a contact message
 * @access  Public
 */
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Please include name, email, and message',
    });
  }
  
  // Create a new message object
  const newMessage = {
    id: Date.now().toString(),
    name,
    email,
    subject: subject || 'No Subject',
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  // In a real app, this would save to a database
  messages.push(newMessage);
  
  res.status(201).json({
    status: 'success',
    message: 'Message sent successfully',
    data: newMessage,
  });
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 * @access  Private
 */
router.get('/', authenticate, (req, res) => {
  res.json({
    status: 'success',
    data: messages,
  });
});

/**
 * @route   GET /api/contact/:id
 * @desc    Get contact message by ID
 * @access  Private
 */
router.get('/:id', authenticate, (req, res) => {
  const message = messages.find(m => m.id === req.params.id);
  
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
});

/**
 * @route   PUT /api/contact/:id
 * @desc    Mark message as read
 * @access  Private
 */
router.put('/:id', authenticate, (req, res) => {
  const messageIndex = messages.findIndex(m => m.id === req.params.id);
  
  if (messageIndex === -1) {
    return res.status(404).json({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Message not found',
    });
  }
  
  messages[messageIndex] = {
    ...messages[messageIndex],
    read: true,
  };
  
  res.json({
    status: 'success',
    message: 'Message marked as read',
    data: messages[messageIndex],
  });
});

export default router;