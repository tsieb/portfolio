import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication for development
  // In a real app, this would validate against a database
  if (email === 'admin@example.com' && password === 'password') {
    const payload = {
      userId: '1',
      role: 'admin',
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          status: 'success',
          data: {
            token,
            user: {
              id: '1',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin',
            }
          }
        });
      }
    );
  } else {
    res.status(401).json({
      status: 'error',
      code: 'AUTH_ERROR',
      message: 'Invalid credentials',
    });
  }
});

export default router;