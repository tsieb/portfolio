// File: /backend/src/server.js
// Enhanced server file with Spotify integration and API routes

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment variables
require('dotenv').config();

// Import database connection
const { connectDB } = require('./db/connection');

// Import middleware
const errorMiddleware = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/api/auth');
const spotifyRoutes = require('./routes/api/spotify');
const userRoutes = require('./routes/api/users');
const notificationRoutes = require('./routes/api/notifications');
const settingsRoutes = require('./routes/api/settings');
const adminRoutes = require('./routes/api/admin');

// Initialize express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Global rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 100 requests per window
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// Enable CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:3000',
    credentials: true,
  })
);

// Parse JSON request body
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parse cookies
app.use(cookieParser());

// Compress responses
app.use(compression());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

// Error handling middleware (should be last)
app.use(errorMiddleware);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Connect to MongoDB
  try {
    await connectDB();
    console.log('MongoDB connected');
    
    // Initialize the Spotify service
    const { initializeSpotifyService } = require('./services/spotify');
    await initializeSpotifyService();
    console.log('Spotify service initialized');
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server; // Export for testing purposes