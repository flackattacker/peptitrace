const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/database');
const { seedPeptides, seedEffects } = require('./services/seedService');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/peptides', require('./routes/peptideRoutes'));
app.use('/api/experiences', require('./routes/experienceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));
app.use('/api/effects', require('./routes/effectRoutes'));

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI_SET: !!process.env.DATABASE_URL
  });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Ignoring for local development...');
  // Do nothing - prevent server from shutting down
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
}); 