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
import predictionRoutes from './modules/prediction/prediction.routes.js';

const app = express(); 

connectDB();

app.use(helmet()); 
app.use(mongoSanitize()); 
 

const corsOptions = { 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(requestLogger);

app.use(morgan('combined', { stream: logger.stream }));


app.use('/api', apiLimiter);


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
app.use('/api/predictions', predictionRoutes);


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CardioShield AI API',
    version: '1.0.0',
    description: 'Early Cardiovascular Risk Stratification Platform',
    documentation: '/api/docs',
  });
});

app.use(notFound);

app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`
CardioShield AI API running in ${NODE_ENV} mode on port ${PORT}
  `);
  logger.info('Server started successfully', {
    port: PORT,
    environment: NODE_ENV,
    nodeVersion: process.version,
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', {
    message: err.message,
    stack: err.stack,
  });
  
  server.close(() => {
    logger.error('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
  });
  
  logger.error('Server shutting down due to uncaught exception');
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed - Process terminated gracefully');
  });
});

export default app;
