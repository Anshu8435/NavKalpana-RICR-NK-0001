import jwt from 'jsonwebtoken';
import User from '../modules/auth/user.model.js';
import ErrorResponse from '../shared/errorResponse.js';
import { verifyToken } from '../shared/utils.js';
import logger from '../config/logger.js';


const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      logger.warn('Authentication failed - No token provided', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      });
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

   
    const decoded = verifyToken(token);

    if (!decoded) {
      logger.warn('Authentication failed - Invalid or expired token', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      });
      return next(new ErrorResponse('Invalid or expired token', 401));
    }


    const user = await User.findById(decoded.id);

    if (!user) {
      logger.warn('Authentication failed - User not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: decoded.id,
      });
      return next(new ErrorResponse('User no longer exists', 401));
    }

  
    if (!user.isActive) {
      logger.warn('Authentication failed - Account deactivated', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: user._id,
        email: user.email,
      });
      return next(new ErrorResponse('Your account has been deactivated', 401));
    }


    if (!user.isEmailVerified) {
      logger.warn('Authentication failed - Email not verified', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: user._id,
        email: user.email,
      });
      return next(new ErrorResponse('Please verify your email to access this resource', 403));
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      logger.warn('Authentication failed - Password changed after token issued', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: user._id,
        email: user.email,
      });
      return next(
        new ErrorResponse('Password was recently changed. Please login again.', 401)
      );
    }

    logger.debug('Authentication successful', {
      method: req.method,
      url: req.originalUrl,
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      error: error.message,
      stack: error.stack,
    });
    next(new ErrorResponse('Not authorized to access this route', 401));
  }
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed - Insufficient permissions', {
        method: req.method,
        url: req.originalUrl,
        userId: req.user._id,
        email: req.user.email,
        userRole: req.user.role,
        requireRoles: roles,
      });
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    
    logger.debug('Authorization successful', {
      method: req.method,
      url: req.originalUrl,
      userId: req.user._id,
      role: req.user.role,
    });
    
    next();
  };
};




export {
  protect,
  authorize,
};
