import nodemailer from 'nodemailer';
import logger from './logger.js';

const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    logger.debug('Creating production email transporter');
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    logger.debug('Creating development email transporter');
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

// Verifies transporter connectivity without throwing in production startup.
const verifyTransporter = async () => {
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
