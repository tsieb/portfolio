// /backend/src/middleware/error.js
const logger = require('../utils/logger');
const config = require('../config/env');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const errorMiddleware = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.message}`, { 
    url: req.originalUrl,
    method: req.method,
    stack: config.NODE_ENV === 'development' ? err.stack : null
  });

  // Set default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let details = err.details || null;
  let code = err.code || 'SERVER_ERROR';

  // Handle validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = err.array().map(error => ({
      field: error.param,
      message: error.msg
    }));
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
  }

  // Handle mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    code = 'INVALID_DATA';
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    code = 'DUPLICATE_ERROR';
    details = Object.keys(err.keyValue).map(key => ({
      field: key,
      message: `${key} already exists`
    }));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'AUTHENTICATION_ERROR';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'AUTHENTICATION_ERROR';
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    code,
    message,
    details,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;