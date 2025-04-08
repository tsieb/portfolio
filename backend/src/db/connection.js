// /backend/src/db/connection.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../config/env');

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      // MongoDB connection options are automatically set in newer mongoose versions
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 * Useful for testing and graceful shutdown
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};