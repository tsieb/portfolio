import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Interface for decoded JWT token
 */
interface IDecodedToken {
  userId: string;
  role: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IDecodedToken;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_ERROR',
        message: 'Authentication required',
      });
    }
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'default_secret'
    ) as IDecodedToken;
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      code: 'AUTH_ERROR',
      message: 'Invalid token',
    });
  }
};

/**
 * Authorization middleware
 * Checks if user has required role
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_ERROR',
        message: 'Authentication required',
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        code: 'AUTH_ERROR',
        message: 'Insufficient permissions',
      });
    }
    
    next();
  };
};