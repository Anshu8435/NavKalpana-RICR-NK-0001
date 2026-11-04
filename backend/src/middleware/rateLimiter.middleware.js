import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

const getClientIp = (req) => {
  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp) return (Array.isArray(cfIp) ? cfIp[0] : cfIp).trim();

  const realIp = req.headers['x-real-ip'];
  if (realIp) return (Array.isArray(realIp) ? realIp[0] : realIp).trim();

  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const list = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return list.split(',')[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 3000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  keyGenerator: (req) => getClientIp(req),
  validate: false,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 2000 : 300,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  skipSuccessfulRequests: true,
  keyGenerator: (req) => getClientIp(req),
  validate: false,
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 200 : 60,
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 15 minutes.',
  },
  keyGenerator: (req) => getClientIp(req),
  validate: false,
  standardHeaders: true,
  legacyHeaders: false,
});

const emailVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 200 : 60,
  message: {
    success: false,
    message: 'Too many verification email requests, please try again after 15 minutes.',
  },
  keyGenerator: (req) => getClientIp(req),
  validate: false,
  standardHeaders: true,
  legacyHeaders: false,
});

export {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
};
