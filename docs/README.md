# CardioShield AI - Backend Authentication System

Production-ready authentication system for CardioShield AI - Early Cardiovascular Risk Stratification Platform.

## 🚀 Features

### ✅ Complete Authentication System
- ✨ User Registration with Email Verification
- 🔐 Secure Login/Logout
- 📧 Email Verification (24-hour expiry)
- 🔑 Password Reset via Email (1-hour expiry)
- 🔄 Change Password (for logged-in users)
- 👤 User Profile Management
- 📬 Resend Verification Email

### 🛡️ Security Features
- 🔒 **Password Hashing**: bcryptjs with salt rounds of 12
- 🎫 **JWT Authentication**: Secure token-based auth
- 🍪 **HTTP-only Cookies**: Secure cookie storage
- 🚫 **Rate Limiting**: Prevent brute force attacks
- 🔐 **Account Locking**: Auto-lock after 5 failed login attempts
- 🧹 **Input Validation**: Joi validation for all inputs
- 🛡️ **NoSQL Injection Prevention**: mongo-sanitize
- 🔒 **Security Headers**: Helmet.js
- 🌐 **CORS Protection**: Configured CORS
- ✅ **Email Verification**: Mandatory email verification
- 🔄 **Password Strength**: Enforced strong passwords

### 📧 Email System
- Professional HTML email templates
- Email verification with branded design
- Password reset emails
- Welcome emails after verification
- Configurable SMTP (Gmail, SendGrid, AWS SES)

### 📊 User Features
- Role-based access (user, doctor, admin)
- Account locking after failed attempts
- Password change tracking
- Last login tracking
- Profile management
- Active/inactive account status

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                          # Main application entry
│   ├── config/
│   │   ├── database.js                 # MongoDB connection
│   │   └── email.js                    # Email configuration
│   ├── modules/
│   │   └── auth/
│   │       ├── user.model.js           # User model with security
│   │       ├── auth.service.js         # Business logic
│   │       ├── auth.controller.js      # Request handlers
│   │       └── auth.routes.js          # API routes
│   ├── middleware/
│   │   ├── auth.middleware.js          # JWT verification
│   │   ├── validation.middleware.js    # Input validation
│   │   ├── error.middleware.js         # Error handling
│   │   └── rateLimiter.middleware.js   # Rate limiting
│   └── shared/
│       ├── utils.js                    # Helper functions
│       ├── errorResponse.js            # Custom error class
│       └── emailTemplates.js           # Email HTML templates
├── .env.example                        # Environment variables template
├── package.json
└── README.md
```

## 🔧 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/cardioshield-ai
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=CardioShield AI
```

### 3. Gmail Setup (for Email Verification)

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to Security → 2-Step Verification → App Passwords
   - Select "Mail" and "Other"
   - Copy the generated password
   - Use this as `EMAIL_PASSWORD` in .env

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your Atlas connection string
```

### 5. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:5000`

## 📚 API Endpoints

### Public Routes

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "userId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

#### 2. Verify Email
```http
GET /api/auth/verify-email/:token
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "token": "jwt-token-here",
  "user": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true,
    "role": "user"
  }
}
```

#### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 4. Resend Verification Email
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 5. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 6. Reset Password
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "NewSecurePass123!"
}
```

### Protected Routes (Require Authentication)

**Authorization Header:**
```
Authorization: Bearer <jwt-token>
```

#### 7. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 8. Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass123!"
}
```

#### 9. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

#### 10. Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## 🔒 Security Implementation

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Password Reset**: 3 attempts per hour
- **Email Verification**: 3 attempts per hour

### Account Locking
- Locks after 5 failed login attempts
- Lock duration: 2 hours
- Automatic unlock after duration

### Token Expiry
- **Access Token**: 7 days (configurable)
- **Email Verification**: 24 hours
- **Password Reset**: 1 hour

## 🧪 Testing

### Test with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

**Get Current User:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📧 Email Templates

Professional HTML email templates included for:
- ✅ Email Verification
- 🔑 Password Reset
- 👋 Welcome Email

All templates are branded with CardioShield AI design and responsive.

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **nodemailer** - Email sending
- **Joi** - Validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **cors** - CORS handling
- **morgan** - Logging

## 🚀 Production Deployment

### Environment Variables
Update these for production:
- Change `JWT_SECRET` to a strong random string
- Change `JWT_REFRESH_SECRET` to a different random string
- Set `NODE_ENV=production`
- Use production MongoDB URI (MongoDB Atlas)
- Configure production email service (SendGrid, AWS SES)
- Update `FRONTEND_URL` to production domain

### Security Checklist
- ✅ Strong JWT secrets
- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Database authentication enabled
- ✅ Rate limiting configured
- ✅ CORS properly configured
- ✅ Email service configured
- ✅ Error logging setup
- ✅ Monitoring enabled

## 📝 Notes

- Email verification is **mandatory** - users cannot login without verifying email
- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens are stored in HTTP-only cookies for security
- Account automatically locks after 5 failed login attempts
- All sensitive operations are rate-limited
- Input validation prevents malicious data
- NoSQL injection prevention enabled

## 🤝 Support

For issues or questions, please contact the development team.

## 📄 License

ISC

---

Built with ❤️ for CardioShield AI - Early Cardiovascular Risk Stratification Platform
