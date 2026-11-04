import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/database.js';
import logger from './config/logger.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import requestLogger from './middleware/requestLogger.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import { verifyTransporter } from './config/email.js';
import predictionRoutes from './modules/prediction/prediction.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '../../frontend/dist');

const app = express();

// Trust proxy - required for Render/Heroku (reverse proxy) so rate limiter & req.ip work correctly
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

connectDB();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(mongoSanitize());

// CORS configuration supporting dynamic origins, local development ports, and deployed apps
const getAllowedOrigins = () => {
  const origins = [];

  if (process.env.ALLOWED_ORIGINS) {
    origins.push(...process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()));
  }

  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL.trim());
  }

  origins.push('http://localhost:5173', 'http://127.0.0.1:5173');

  return [...new Set(origins.filter(Boolean))];
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, health checks)
    if (!origin) {
      return callback(null, true);
    }

    const allowed = getAllowedOrigins();

    // In development: allow any localhost/127.0.0.1 port (5173, 5174, 3000, etc.)
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isRenderApp = /^https:\/\/([a-zA-Z0-9-]+\.)*onrender\.com$/.test(origin);
    const isVercelApp = /^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/.test(origin);

    if (
      allowed.includes(origin) ||
      (process.env.NODE_ENV !== 'production' && isLocalhost) ||
      isRenderApp ||
      isVercelApp
    ) {
      return callback(null, true);
    }

    logger.warn('CORS request blocked', { origin, allowedOrigins: allowed });
    return callback(new Error('Not allowed by CORS'));
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

// API Routes (support both /api prefixed routes and direct aliases)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/predictions', predictionRoutes);

// Static frontend delivery & SPA client-side fallback
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get('*', (req, res, next) => {
    if (
      req.originalUrl.startsWith('/api') ||
      req.originalUrl.startsWith('/auth') ||
      req.originalUrl.startsWith('/predictions') ||
      req.originalUrl === '/health'
    ) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to CardioShield AI API',
      version: '1.0.0',
      description: 'Early Cardiovascular Risk Stratification Platform',
      documentation: '/api/docs',
    });
  });
}

app.use(notFound);

app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, HOST, () => {
    console.log(`
CardioShield AI API running in ${NODE_ENV} mode on http://${HOST}:${PORT}
    `);
    logger.info('Server started successfully', {
      port: PORT,
      host: HOST,
      environment: NODE_ENV,
      nodeVersion: process.version,
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use by another process. Please close it or choose another PORT.`);
    } else {
      logger.error('Server error occurred', { message: err.message, stack: err.stack });
    }
    process.exit(1);
  });
}

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
