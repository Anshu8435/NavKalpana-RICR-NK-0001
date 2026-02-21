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
    return nodemailer.createTransporter({
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
