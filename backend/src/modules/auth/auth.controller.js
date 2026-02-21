import * as authService from './auth.service.js';
import ErrorResponse from '../../shared/errorResponse.js';
import { getCookieOptions } from '../../shared/utils.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.registerUser({ name, email, password });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const result = await authService.verifyEmail(token);

    res.cookie('token', result.token, getCookieOptions());

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.cookie('token', result.token, getCookieOptions());

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.resendVerificationEmail(email);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await authService.resetPassword(token, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;

    const result = await authService.updateProfile(req.user.id, updates);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    const result = await authService.logoutUser(req.user.id);

    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export {
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
};
