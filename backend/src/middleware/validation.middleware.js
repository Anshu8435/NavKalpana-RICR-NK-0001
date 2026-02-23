import Joi from 'joi';
import ErrorResponse from '../shared/errorResponse.js';
import logger from '../config/logger.js';


const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      logger.warn('Validation failed', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?._id,
        validationErrors: errors,
      });

      return next(new ErrorResponse('Validation failed', 400, errors));
    }

    req.body = value;
    next();
  };
};


const authValidation = {
  // Register validation
  register: Joi.object({
    name: Joi.string().min(2).max(50).trim().required().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required',
      }),
  }),

  // Login validation
  login: Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  // Resend verification
  resendVerification: Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  }),

  // Forgot password
  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  }),

  // Reset password
  resetPassword: Joi.object({
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required',
      }),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters',
        'string.max': 'New password cannot exceed 128 characters',
        'string.pattern.base':
          'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required',
      }),
  }),

  // Update profile
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).trim().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
    }),
   
    dateOfBirth: Joi.date().max('now').messages({
      'date.max': 'Date of birth cannot be in the future',
    }),
    gender: Joi.string().valid('male', 'female', 'other').messages({
      'any.only': 'Gender must be either male, female, or other',
    }),
  }).min(1).messages({
    'object.min': 'At least one field is required to update',
  }),
};

export {
  validate,
  authValidation,
};
