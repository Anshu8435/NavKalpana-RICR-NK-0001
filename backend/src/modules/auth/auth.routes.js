import express from 'express';
import {
  register,
  verifyEmail,
  login,
  getMe,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  logout,
} from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validate, authValidation } from '../../middleware/validation.middleware.js';
import {
  authLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
} from '../../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  validate(authValidation.register),
  register
);

router.get('/verify-email/:token', verifyEmail);

router.post(
  '/login',
  authLimiter,
  validate(authValidation.login),
  login
);

router.post(
  '/resend-verification',
  emailVerificationLimiter,
  validate(authValidation.resendVerification),
  resendVerification
);

router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate(authValidation.forgotPassword),
  forgotPassword
);

router.post(
  '/reset-password/:token',
  passwordResetLimiter,
  validate(authValidation.resetPassword),
  resetPassword
);

router.get('/me', protect, getMe);

router.put(
  '/change-password',
  protect,
  validate(authValidation.changePassword),
  changePassword
);

router.put(
  '/profile',
  protect,
  validate(authValidation.updateProfile),
  updateProfile
);

router.post('/logout', protect, logout);

export default router;
