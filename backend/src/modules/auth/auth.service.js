import User from './user.model.js';
import sendEmail from '../../config/email.js';
import logger from '../../config/logger.js';
import {
  generateToken,
  generateVerificationToken,
  generatePasswordResetToken,
  hashToken,
  sanitizeUser,
} from '../../shared/utils.js';
import {
  emailVerificationTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
} from '../../shared/emailTemplates.js';
import ErrorResponse from '../../shared/errorResponse.js';


const registerUser = async (userData) => {
  const { name, email, password } = userData;

  logger.info('User registration attempt', { email, name });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isEmailVerified) {
      logger.warn('Registration failed - User already exists', { email });
      throw new ErrorResponse('User already exists with this email', 400);
    } else {
      logger.info('Resending verification email to unverified user', { email });
      
      const { token, hashedToken, expiresAt } = generateVerificationToken();
      
      existingUser.verificationToken = hashedToken;
      existingUser.verificationTokenExpires = expiresAt;
      await existingUser.save();

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
      await sendEmail({
        to: email,
        subject: 'Verify Your CardioShield AI Account',
        html: emailVerificationTemplate(name, verificationUrl),
      });

      logger.logAuth('resend-verification', existingUser._id, true, { email });

      return {
        success: true,
        message: 'Verification email has been resent. Please check your inbox.',
        userId: existingUser._id,
      };
    }
  }

  const { token, hashedToken, expiresAt } = generateVerificationToken();

  const user = await User.create({
    name,
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpires: expiresAt,
  });

  logger.info('New user created successfully', {
    userId: user._id,
    email: user.email,
    name: user.name,
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  try {
    await sendEmail({
      to: email,
      subject: 'Verify Your CardioShield AI Account',
      html: emailVerificationTemplate(name, verificationUrl),
    });
    
    logger.logAuth('register', user._id, true, { email });
  } catch (error) {
    logger.error('Failed to send verification email, deleting user', {
      userId: user._id,
      email,
      error: error.message,
    });
    
    await User.findByIdAndDelete(user._id);
    throw new ErrorResponse('Failed to send verification email. Please try again.', 500);
  }

  return {
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    userId: user._id,
  };
};


const verifyEmail = async (token) => {
  logger.debug('Email verification attempt');
  
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    logger.warn('Email verification failed - Invalid or expired token');
    throw new ErrorResponse('Invalid or expired verification token', 400);
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  logger.info('Email verified successfully', {
    userId: user._id,
    email: user.email,
  });

  // Send welcome email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to CardioShield AI! 🎉',
      html: welcomeEmailTemplate(user.name),
    });
  } catch (error) {
    logger.error('Failed to send welcome email', {
      userId: user._id,
      email: user.email,
      error: error.message,
    });
    // Don't throw error if welcome email fails
  }

  logger.logAuth('verify-email', user._id, true, { email: user.email });

  // Generate JWT token
  const jwtToken = generateToken(user._id);

  return {
    success: true,
    message: 'Email verified successfully!',
    token: jwtToken,
    user: sanitizeUser(user),
  };
};


const loginUser = async (email, password) => {
  logger.info('Login attempt', { email });
  
  const user = await User.findByCredentials(email, password);

  if (!user) {
    logger.warn('Login failed - Invalid credentials', { email });
    throw new ErrorResponse('Invalid email or password', 401);
  }

  if (!user.isEmailVerified) {
    logger.warn('Login failed - Email not verified', { email, userId: user._id });
    throw new ErrorResponse('Please verify your email before logging in', 403);
  }

  if (!user.isActive) {
    logger.warn('Login failed - Account deactivated', { email, userId: user._id });
    throw new ErrorResponse('Your account has been deactivated. Please contact support.', 403);
  }

  logger.info('Login successful', {
    userId: user._id,
    email: user.email,
    role: user.role,
  });
  
  logger.logAuth('login', user._id, true, { email });

  const token = generateToken(user._id);

  return {
    success: true,
    message: 'Login successful',
    token,
    user: sanitizeUser(user),
  };
};


const getCurrentUser = async (userId) => {
  logger.debug('Fetching current user data', { userId });
  
  const user = await User.findById(userId);

  if (!user) {
    logger.warn('User not found', { userId });
    throw new ErrorResponse('User not found', 404);
  }

  logger.debug('User data retrieved successfully', { userId, email: user.email });

  return {
    success: true,
    user: sanitizeUser(user),
  };
};


const resendVerificationEmail = async (email) => {
  logger.info('Resend verification email request', { email });
  
  const user = await User.findOne({ email });

  if (!user) {
    logger.warn('Resend verification failed - User not found', { email });
    throw new ErrorResponse('No user found with this email', 404);
  }

  if (user.isEmailVerified) {
    logger.warn('Resend verification failed - Email already verified', { email, userId: user._id });
    throw new ErrorResponse('Email is already verified', 400);
  }

  const { token, hashedToken, expiresAt } = generateVerificationToken();

  user.verificationToken = hashedToken;
  user.verificationTokenExpires = expiresAt;
  await user.save();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  try {
    await sendEmail({
      to: email,
      subject: 'Verify Your CardioShield AI Account',
      html: emailVerificationTemplate(user.name, verificationUrl),
    });
    
    logger.info('Verification email resent successfully', { email, userId: user._id });
  } catch (error) {
    logger.error('Failed to resend verification email', { email, userId: user._id, error: error.message });
    throw new ErrorResponse('Failed to send verification email. Please try again later.', 500);
  }

  return {
    success: true,
    message: 'Verification email sent successfully',
  };
};


const forgotPassword = async (email) => {
  logger.info('Password reset requested', { email });
  
  const user = await User.findOne({ email, isActive: true });

  if (!user) {
    logger.warn('Password reset request for non-existent/inactive account', { email });
    // Return success message to prevent email enumeration attacks
    return {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  }

  const { token, hashedToken, expiresAt } = generatePasswordResetToken();

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiresAt;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset Request - CardioShield AI',
      html: passwordResetTemplate(user.name, resetUrl),
    });
    
    logger.info('Password reset email sent successfully', { email, userId: user._id });
    logger.logAuth('password_reset_request', user._id, true, { email });
  } catch (error) {
    logger.error('Failed to send password reset email', { 
      email, 
      userId: user._id, 
      error: error.message 
    });
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new ErrorResponse('Failed to send password reset email', 500);
  }

  return {
    success: true,
    message: 'If an account exists with this email, a password reset link has been sent.',
  };
};

const resetPassword = async (token, newPassword) => {
  logger.info('Password reset attempt with token');
  
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    logger.warn('Password reset failed - Invalid or expired token');
    throw new ErrorResponse('Invalid or expired reset token', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  logger.info('Password reset successful', { 
    userId: user._id, 
    email: user.email 
  });
  
  logger.logAuth('password_reset_complete', user._id, true, { email: user.email });

  const jwtToken = generateToken(user._id);

  return {
    success: true,
    message: 'Password reset successful',
    token: jwtToken,
    user: sanitizeUser(user),
  };
};  


const changePassword = async (userId, currentPassword, newPassword) => {
  logger.info('Password change attempt', { userId });
  
  const user = await User.findById(userId).select('+password');

  if (!user) {
    logger.warn('Password change failed - User not found', { userId });
    throw new ErrorResponse('User not found', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    logger.warn('Password change failed - Incorrect current password', { 
      userId, 
      email: user.email 
    });
    throw new ErrorResponse('Current password is incorrect', 401);
  }

  const isSame = await user.comparePassword(newPassword);
  if (isSame) {
    logger.warn('Password change failed - New password same as current', { 
      userId, 
      email: user.email 
    });
    throw new ErrorResponse('New password must be different from current password', 400);
  }

  user.password = newPassword;
  await user.save();

  logger.info('Password changed successfully', { 
    userId, 
    email: user.email 
  });
  
  logger.logAuth('password_change', userId, true, { email: user.email });

  const token = generateToken(user._id);

  return {
    success: true,
    message: 'Password changed successfully',
    token,
  };
};


const updateProfile = async (userId, updates) => {
  logger.info('Profile update attempt', { userId, fields: Object.keys(updates) });
  
  const allowedUpdates = ['name', 'phoneNumber', 'dateOfBirth', 'gender'];
  const filteredUpdates = {};

  Object.keys(updates).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    logger.warn('Profile update failed - No valid fields provided', { userId });
    throw new ErrorResponse('No valid fields to update', 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true, runValidators: true }
  );

  if (!user) {
    logger.warn('Profile update failed - User not found', { userId });
    throw new ErrorResponse('User not found', 404);
  }

  logger.info('Profile updated successfully', { 
    userId, 
    email: user.email,
    updatedFields: Object.keys(filteredUpdates) 
  });

  return {
    success: true,
    message: 'Profile updated successfully',
    user: sanitizeUser(user),
  };
};


const logoutUser = async (userId) => {
  logger.info('User logged out', { userId });
  logger.logAuth('logout', userId, true);
  
  return {
    success: true,
    message: 'Logout successful',
  };
};

export {
  registerUser,
  verifyEmail,
  loginUser,
  getCurrentUser,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  logoutUser,
};
