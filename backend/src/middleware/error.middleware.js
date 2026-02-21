import ErrorResponse from '../shared/errorResponse.js';
import logger from '../config/logger.js';


const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with full context
  const errorContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?._id,
    statusCode: error.statusCode || 500,
    errorName: err.name,
    errorCode: err.code,
  };

  // Log error with appropriate level
  if (error.statusCode >= 500 || !error.statusCode) {
    logger.error('Server error occurred', {
      ...errorContext,
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn('Client error occurred', {
      ...errorContext,
      message: err.message,
    });
  }

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
    logger.warn('Invalid resource ID format', {
      ...errorContext,
      value: err.value,
      path: err.path,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new ErrorResponse(message, 400);
    logger.warn('Duplicate key error', {
      ...errorContext,
      field,
      value: err.keyValue[field],
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    error = new ErrorResponse('Validation failed', 400, errors);
    logger.warn('Validation error', {
      ...errorContext,
      validationErrors: errors,
    });
  }

  
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
    logger.warn('Invalid JWT token', errorContext);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    error = new ErrorResponse(message, 401);
    logger.warn('Expired JWT token', errorContext);
  }


  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    errors: error.errors || null,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};


const notFound = (req, res, next) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  
  const error = new ErrorResponse(
    `Route not found - ${req.originalUrl}`,
    404
  );
  next(error);
};

export {
  errorHandler,
  notFound,
};
