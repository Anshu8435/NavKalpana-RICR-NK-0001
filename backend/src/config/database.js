import mongoose from 'mongoose';
import logger from './logger.js';
import { getMongoUri } from './env.js';

const connectDB = async () => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    
    const mongoUri = getMongoUri();
    const conn = await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully', {
      host: conn.connection.host,
      database: conn.connection.name,
      port: conn.connection.port,
    });
    
    logger.logDB('MongoDB connection established', true, {
      host: conn.connection.host,
    });
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', {
        error: err.message,
        stack: err.stack,
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected', {
        timestamp: new Date().toISOString(),
      });
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error.message,
      stack: error.stack,
    });
    logger.logDB('MongoDB connection failed', false, {
      error: error.message,
    });
    process.exit(1);
  }
};

export default connectDB;
