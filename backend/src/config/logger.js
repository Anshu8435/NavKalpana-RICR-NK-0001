import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  // Add stack trace for errors
  if (stack) {
    msg += `\n${stack}`;
  }
  
  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Console format with colors
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  logFormat
);

// File format without colors
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  logFormat
);

// Create logs directory path (used only in development/local — Render has ephemeral disk)
const logsDir = path.join(__dirname, '../../logs');

// Build transports based on environment
const transports = [];

// In production (Render/cloud), rely only on console logging.
// Render captures stdout/stderr automatically — file logs are lost on redeploy.
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        winston.format.json() // structured JSON for cloud log aggregation
      ),
      level: 'info',
    })
  );
} else {
  // Development: file rotation + colorful console
  const dailyRotateFileTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
  });

  const errorRotateFileTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: fileFormat,
  });

  transports.push(dailyRotateFileTransport, errorRotateFileTransport);
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug',
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Create a stream object for Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Helper methods for common logging patterns
logger.logRequest = (req, message = 'Request received') => {
  logger.info(message, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
};

logger.logAuth = (action, userId, success, metadata = {}) => {
  logger.info(`Auth: ${action}`, {
    userId,
    success,
    ...metadata,
  });
};

logger.logEmail = (to, subject, success, error = null) => {
  if (success) {
    logger.info('Email sent successfully', { to, subject });
  } else {
    logger.error('Email sending failed', { to, subject, error: error?.message });
  }
};

logger.logDB = (action, success, metadata = {}) => {
  if (success) {
    logger.info(`Database: ${action}`, metadata);
  } else {
    logger.error(`Database: ${action} failed`, metadata);
  }
};

export default logger;