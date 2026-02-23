// Email verification template
const emailVerificationTemplate = (userName, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; }
        .content { color: #333; line-height: 1.6; }
        .button { display: inline-block; padding: 14px 30px; margin: 20px 0; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .button:hover { background: #1d4ed8; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
        .note { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">❤️ CardioShield AI</div>
          <p style="color: #666;">Early Cardiovascular Risk Stratification Platform</p>
        </div>
        
        <div class="content">
          <h2>Welcome, ${userName}! 🎉</h2>
          <p>Thank you for registering with CardioShield AI. We're excited to have you join our mission to prevent cardiovascular diseases through early detection.</p>
          
          <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <div class="note">
            <strong>⚠️ Security Notice:</strong> This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} CardioShield AI. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const passwordResetTemplate = (userName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #dc2626; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; }
        .content { color: #333; line-height: 1.6; }
        .button { display: inline-block; padding: 14px 30px; margin: 20px 0; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .button:hover { background: #b91c1c; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
        .warning { background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">❤️ CardioShield AI</div>
          <p style="color: #666;">Password Reset Request</p>
        </div>
        
        <div class="content">
          <h2>Hello, ${userName}</h2>
          <p>We received a request to reset your password for your CardioShield AI account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <div class="warning">
            <strong>🔒 Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request this, please ignore this email and your password will remain unchanged.
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} CardioShield AI. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const welcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #059669; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; }
        .content { color: #333; line-height: 1.6; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
        .feature { background: #f0fdf4; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #059669; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">❤️ CardioShield AI</div>
          <h2 style="color: #059669;">✅ Account Verified Successfully!</h2>
        </div>
        
        <div class="content">
          <h2>Welcome aboard, ${userName}! 🎉</h2>
          <p>Your email has been verified and your account is now fully activated.</p>
          
          <p><strong>What's next?</strong></p>
          
          <div class="feature">
            <strong>🏥 Health Assessment</strong><br>
            Complete your cardiovascular risk assessment using our AI-powered platform.
          </div>
          
          <div class="feature">
            <strong>📊 Risk Analysis</strong><br>
            Get personalized risk predictions and preventive recommendations.
          </div>
          
          <div class="feature">
            <strong>🔐 Secure & Private</strong><br>
            Your health data is encrypted and protected with industry-standard security.
          </div>
          
          <p>Thank you for joining CardioShield AI in the fight against cardiovascular diseases!</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} CardioShield AI. All rights reserved.</p>
          <p>Need help? Contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export {
  emailVerificationTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
};
