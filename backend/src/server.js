// /backend/src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./db/connection');
const logger = require('./utils/logger');
const errorMiddleware = require('./middleware/error');
const config = require('./config/env');

// Import routes
const authRoutes = require('./routes/api/auth');
const projectRoutes = require('./routes/api/projects');
const skillRoutes = require('./routes/api/skills');
const contactRoutes = require('./routes/api/contact');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use(errorMiddleware);

// Set port and start server
const PORT = config.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;