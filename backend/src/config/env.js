// /backend/src/config/env.js
require('dotenv').config();

/**
 * Environment configuration
 * Loads from .env file but uses sensible defaults
 */
module.exports = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Server
  PORT: process.env.PORT || 5000,
  
  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-for-development-only',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  
  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};