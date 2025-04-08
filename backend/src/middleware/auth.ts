import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../db/models';
import { logger } from '../utils/logger';

/**
 * Interface for decoded JWT token
 */
interface IDecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
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
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_ERROR',
        message: 'No token, authorization denied',
      });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'default_secret'
    ) as IDecodedToken;
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_ERROR',
        message: 'User does not exist',
      });
    }
    
    // Add user to request
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    
    // Handle different error types
    if ((error as any).name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
      });
    }
    
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
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      });
    }
    
    next();
  };
};