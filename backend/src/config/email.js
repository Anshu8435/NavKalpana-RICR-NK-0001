import nodemailer from 'nodemailer';
import logger from './logger.js';
import { getEmailPassword, getEmailUser } from './env.js';

const createTransporter = () => {
  const emailUser = getEmailUser();
  const emailPassword = getEmailPassword();
  const hasEmailCredentials = Boolean(emailUser && emailPassword);

  const transportConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.NODE_ENV === 'production',
  };

  if (hasEmailCredentials) {
    transportConfig.auth = {
      user: emailUser,
      pass: emailPassword,
    };
  } else {
    logger.warn('Email SMTP credentials not configured; skipping auth for email transport');
  }

  logger.debug('Creating email transporter', {
    hasEmailCredentials,
    host: transportConfig.host,
    port: transportConfig.port,
    secure: transportConfig.secure,
  });

  return nodemailer.createTransport(transportConfig);
};

// Verifies transporter connectivity without throwing in production startup.
const verifyTransporter = async () => {
  const emailUser = getEmailUser();
  const emailPassword = getEmailPassword();

  if (!emailUser || !emailPassword) {
    logger.warn('Email transporter verification skipped because SMTP credentials are missing');
    return false;
  }

  try {
    const transporter = createTransporter();
    // set a reasonable timeout to avoid very long hangs
    transporter.options = transporter.options || {};
    transporter.options.connectionTimeout = transporter.options.connectionTimeout || 10000;
    await transporter.verify();
    logger.info('Email transporter verified successfully');
    return true;
  } catch (err) {
    logger.error('Email transporter verification failed', { error: err.message });
    // Do not throw to prevent crashing the live site, but surface the problem in logs
    return false;
  }
};

const sendEmail = async (options) => {
  const emailUser = getEmailUser();
  const emailPassword = getEmailPassword();

  if (!emailUser || !emailPassword) {
    throw new Error('Email services are not configured. Add EMAIL_USER and EMAIL_PASSWORD before sending mail.');
  }

  try {
    logger.debug('Preparing to send email', {
      to: options.to,
      subject: options.subject,
    });
    
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
      response: info.response,
    });
    
    logger.logEmail(options.to, options.subject, true);
    
    return info;
  } catch (error) {
    logger.error('Email sending failed', {
      to: options.to,
      subject: options.subject,
      error: error.message,
      stack: error.stack,
    });
    
    logger.logEmail(options.to, options.subject, false, error);
    
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
export { verifyTransporter, createTransporter };
