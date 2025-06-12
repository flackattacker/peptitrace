const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Database URL being used:', process.env.DATABASE_URL);
    
    // Add connection options for better compatibility
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.DATABASE_URL, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Error handling after initial connection
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB shutdown:', err);
        process.exit(1);
      }
    });

    return true;

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Error details:', error);
    console.error('Make sure MongoDB is running or check your DATABASE_URL in .env file');
    
    // In development, warn but don't crash - allow server to start
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Running in development mode without database connection');
      console.warn('⚠️  Some features may not work properly');
      return false;
    }
    
    // In production, crash if no database
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};