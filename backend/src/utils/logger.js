// /backend/src/utils/logger.js
const winston = require('winston');
const config = require('../config/env');

// Define the custom format with timestamp and colorization
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`;
  })
);

// Configure the Winston logger
const logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: customFormat,
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        customFormat
      ),
    }),
    
    // File transport for production
    ...(config.NODE_ENV === 'production' 
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' })
        ] 
      : [])
  ],
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        customFormat
      ),
    }),
    ...(config.NODE_ENV === 'production' 
      ? [new winston.transports.File({ filename: 'logs/exceptions.log' })] 
      : [])
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        customFormat
      ),
    }),
    ...(config.NODE_ENV === 'production' 
      ? [new winston.transports.File({ filename: 'logs/rejections.log' })] 
      : [])
  ],
  exitOnError: false
});

module.exports = logger;