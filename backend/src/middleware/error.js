// File: /backend/src/middleware/error.js
// Error handling middleware

/**
 * Custom error class with status code and operational flag
 */
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Handle development errors with stack trace
   * @param {Error} err - Error object
   * @param {Object} res - Express response object
   */
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  };
  
  /**
   * Handle production errors without exposing implementation details
   * @param {Error} err - Error object
   * @param {Object} res - Express response object
   */
  const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  };
  
  /**
   * Handle JWT validation errors
   * @param {Error} err - Error object
   * @returns {AppError} Formatted AppError
   */
  const handleJWTError = () => 
    new AppError('Invalid token. Please log in again.', 401);
  
  /**
   * Handle JWT expiration errors
   * @param {Error} err - Error object
   * @returns {AppError} Formatted AppError
   */
  const handleJWTExpiredError = () => 
    new AppError('Your token has expired. Please log in again.', 401);
  
  /**
   * Handle MongoDB duplicate key errors
   * @param {Error} err - Error object
   * @returns {AppError} Formatted AppError
   */
  const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    return new AppError(
      `Duplicate field value: ${value}. Please use another value!`,
      400
    );
  };
  
  /**
   * Handle Mongoose validation errors
   * @param {Error} err - Error object
   * @returns {AppError} Formatted AppError
   */
  const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    return new AppError(
      `Invalid input data. ${errors.join('. ')}`,
      400
    );
  };
  
  /**
   * Main error handling middleware
   * @param {Error} err - Error object
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;
  
      // Handle specific error types
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  
      sendErrorProd(error, res);
    }
  };
  
  // Export AppError for use elsewhere in the application
  module.exports.AppError = AppError;