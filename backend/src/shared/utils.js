import crypto from 'crypto';
import jwt from 'jsonwebtoken';


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};


const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};


const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};


const generateVerificationToken = () => {
  const token = generateRandomToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return { token, hashedToken, expiresAt };
};


const generatePasswordResetToken = () => {
  const token = generateRandomToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  return { token, hashedToken, expiresAt };
};


const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};


const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.verificationToken;
  delete userObj.verificationTokenExpires;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  delete userObj.__v;
  return userObj;
};

export {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateRandomToken,
  hashToken,
  generateVerificationToken,
  generatePasswordResetToken,
  getCookieOptions,
  sanitizeUser,
};
