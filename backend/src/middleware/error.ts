import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface IApiError extends Error {
  statusCode?: number;
  details?: any[];
  code?: string;
}

/**
 * Global error handling middleware
 * Formats and returns consistent error responses
 */
export const errorHandler = (
  err: IApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'SERVER_ERROR';
  const details = err.details || [];

  // Log error
  logger.error(`[ERROR] ${code}: ${message}`, { 
    path: req.path, 
    method: req.method,
    error: err.stack 
  });

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const mongooseError = err as any;
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: Object.keys(mongooseError.errors).map(key => ({
        field: key,
        message: mongooseError.errors[key].message,
      })),
    });
  }

  // Handle Mongoose cast errors (invalid ID)
  if (err.name === 'CastError') {
    const castError = err as any;
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_ID',
      message: `Invalid ${castError.path}: ${castError.value}`,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const duplicateError = err as any;
    const field = Object.keys(duplicateError.keyValue)[0];
    return res.status(400).json({
      status: 'error',
      code: 'DUPLICATE_KEY',
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      code: 'AUTH_ERROR',
      message: 'Invalid token',
    });
  }

  // Handle JWT expiration
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      code: 'TOKEN_EXPIRED',
      message: 'Token has expired',
    });
  }

  // Handle production vs development error details
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    code,
    message,
    details: details.length > 0 ? details : undefined,
    stack: isDevelopment ? err.stack : undefined,
  });
};