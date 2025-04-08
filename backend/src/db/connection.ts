import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Database connection handler
 * Establishes and manages the connection to MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGODB_URI;
    
    if (!dbUri) {
      logger.error('MongoDB URI is not defined in environment variables');
      process.exit(1);
    }
    
    const options = {
      // Connection options
    };
    
    await mongoose.connect(dbUri);
    
    logger.info('MongoDB Connected');
    
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};