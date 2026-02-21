import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/database.js';
import logger from './config/logger.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import requestLogger from './middleware/requestLogger.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// CORS Configuration
const corsOptions = { 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser & cookie parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware - Use custom request logger
app.use(requestLogger);

// Morgan HTTP logger (streams to Winston)
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting
app.use('/api', apiLimiter);

// Health check route
app.get('/health', (req, res) => {
  logger.debug('Health check endpoint accessed');
  res.status(200).json({
    success: true,
    message: 'CardioShield AI API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CardioShield AI API',
    version: '1.0.0',
    description: 'Early Cardiovascular Risk Stratification Platform',
    documentation: '/api/docs',
  });
});

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        ❤️  CardioShield AI - Backend Server Started  ❤️        ║
║                                                                ║
║  Environment: ${NODE_ENV.padEnd(47)} ║
║  Port:        ${PORT.toString().padEnd(47)} ║
║  URL:         http://localhost:${PORT.toString().padEnd(36)} ║
║                                                                ║
║  Early Cardiovascular Risk Stratification Platform            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
  logger.info('Server started successfully', {
    port: PORT,
    environment: NODE_ENV,
    nodeVersion: process.version,
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', {
    message: err.message,
    stack: err.stack,
  });
  
  // Close server & exit process
  server.close(() => {
    logger.error('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
  });
  
  // Exit process
  logger.error('Server shutting down due to uncaught exception');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed - Process terminated gracefully');
  });
});

export default app;
