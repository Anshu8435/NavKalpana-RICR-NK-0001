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
import { verifyTransporter } from './config/email.js';
import predictionRoutes from './modules/prediction/prediction.routes.js';

const app = express();

// Trust proxy - required for Render/Heroku (reverse proxy) so rate limiter & req.ip work correctly
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

connectDB();

app.use(helmet());
app.use(mongoSanitize());

// CORS - support multiple origins via comma-separated ALLOWED_ORIGINS env var
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.FRONTEND_URL || 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
  res.status(200).json({
    success: true,
    message: 'CardioShield AI API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
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

// Verify email transporter asynchronously at startup (non-blocking)
verifyTransporter().then((ok) => {
  if (!ok) {
    logger.warn('Email transporter verification failed at startup — emails may not be delivered');
  }
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
