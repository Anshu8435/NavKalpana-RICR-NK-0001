# CardioShield AI - System Architecture

## Overview

CardioShield AI is a three-tier microservices architecture designed for early cardiovascular risk stratification. The system follows a modular design pattern with clear separation of concerns across Frontend, Backend, and ML Service layers.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite + Tailwind)              │  │
│  │  • User Authentication UI                                  │  │
│  │  • Patient Data Input Forms                                │  │
│  │  • Risk Report Dashboard                                   │  │
│  │  • Visualization Components                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/REST
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          Node.js + Express Backend (Port 5000)            │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │     Auth     │  │  Prediction  │  │    Shared    │   │  │
│  │  │   Module     │  │    Module    │  │   Utilities  │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                            │  │
│  │  Middleware Layer:                                        │  │
│  │  • JWT Authentication                                     │  │
│  │  • Request Validation (Joi)                               │  │
│  │  • Rate Limiting                                          │  │
│  │  • Error Handling                                         │  │
│  │  • Request Logging (Winston)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────┬────────────────────────┬─────────────────────────┘
               │                        │
               │ MongoDB Driver         │ HTTP/REST
               ▼                        ▼
┌─────────────────────────┐  ┌─────────────────────────────────┐
│    DATABASE LAYER       │  │        ML SERVICE LAYER         │
│                         │  │                                 │
│  ┌──────────────────┐   │  │  ┌──────────────────────────┐  │
│  │  MongoDB Atlas   │   │  │  │  FastAPI (Port 8000)     │  │
│  │                  │   │  │  │                          │  │
│  │  Collections:    │   │  │  │  • Feature Engineering  │  │
│  │  • users         │   │  │  │  • Model Loading        │  │
│  │  • visits        │   │  │  │  • Prediction Service   │  │
│  │  • reports       │   │  │  │  • SHAP Explainability  │  │
│  │                  │   │  │  │  • Risk Calculation     │  │
│  └──────────────────┘   │  │  └──────────────────────────┘  │
│                         │  │              │                  │
└─────────────────────────┘  │              ▼                  │
                             │  ┌──────────────────────────┐  │
                             │  │   Pre-trained Models     │  │
                             │  │  • XGBoost Model (.pkl)  │  │
                             │  │  • Scaler (.pkl)         │  │
                             │  └──────────────────────────┘  │
                             └─────────────────────────────────┘
```

---

## Layer-by-Layer Breakdown

### 1. Frontend Layer (React + Vite)

**Technology Stack:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication

**Components:**
```
src/
├── Component/
│   ├── Auth/
│   │   ├── Login.jsx          # User authentication
│   │   └── Signup.jsx         # User registration
│   ├── Home/
│   │   └── HomePage.jsx       # Landing page
│   └── Visit/
│       └── VisitPage.jsx      # Patient data input & report display
├── assets/                     # Static resources
└── main.jsx                    # Application entry point
```

**Key Features:**
- JWT-based authentication with secure token storage
- Form validation for patient data
- Real-time risk visualization
- Responsive design for mobile and desktop

---

### 2. Backend Layer (Node.js + Express)

**Technology Stack:**
- Node.js with Express.js framework
- MongoDB with Mongoose 
- JWT for authentication
- Winston for logging
- Joi for validation

**Architecture Pattern:** Modular MVC + Service Layer

```
backend/src/
├── app.js                      # Application entry point
├── config/
│   ├── database.js             # MongoDB connection
│   ├── email.js                # Email service config
│   └── logger.js               # Winston logger setup
├── middleware/
│   ├── auth.middleware.js      # JWT verification
│   ├── error.middleware.js     # Error handling
│   ├── rateLimiter.middleware.js
│   ├── requestLogger.middleware.js
│   └── validation.middleware.js
├── modules/
│   ├── auth/
│   │   ├── user.model.js       # User schema
│   │   ├── auth.service.js     # Business logic
│   │   ├── auth.controller.js  # Request handlers
│   │   └── auth.routes.js      # Route definitions
│   └── prediction/
│       ├── visit.model.js      # Visit schema
│       ├── report.model.js     # Report schema
│       ├── prediction.service.js
│       ├── prediction.controller.js
│       ├── prediction.routes.js
│       └── prediction.validation.js
└── shared/
    ├── errorResponse.js        # Custom error class
    ├── emailTemplates.js       # Email templates
    └── utils.js                # Helper functions
```

**API Endpoints:**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | User registration | No |
| POST | /api/auth/login | User login | No |
| POST | /api/auth/verify-email | Email verification | No |
| GET | /api/auth/profile | Get user profile | Yes |
| POST | /api/predictions | Create prediction | Yes |
| GET | /api/predictions/reports | Get user reports | Yes |
| GET | /api/predictions/reports/:id | Get specific report | Yes |
| GET | /api/predictions/statistics | User statistics | Yes |
| DELETE | /api/predictions/reports/:id | Delete report | Yes |
| GET | /api/predictions/health | ML service health check | Yes |

**Security Features:**
- Helmet.js for security headers
- CORS configuration
- MongoDB sanitization (NoSQL injection prevention)
- Rate limiting (prevents DDoS)
- JWT token expiration
- Password hashing with bcrypt
- Input validation with Joi

---

### 3. ML Service Layer (FastAPI + Python)

**Technology Stack:**
- FastAPI framework
- scikit-learn for ML models
- SHAP for explainability
- NumPy & Pandas for data processing
- Uvicorn ASGI server

**Architecture:**

```
ml_server/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── routes/
│   │   └── predict.py          # Prediction endpoints
│   ├── services/
│   │   ├── model_loader.py     # Load pre-trained models
│   │   └── predictor.py        # Prediction logic
│   ├── preprocessing/
│   │   └── feature_engineering.py
│   └── utils/
│       └── risk_utils.py       # Risk categorization
└── saved_models/
    ├── cardioshield_final_model.pkl
    └── scaler.pkl
```

**ML Pipeline Flow:**
```
Input Data → Feature Engineering → Scaling → Model Prediction
    ↓
Probability Calibration → Risk Categorization → SHAP Explanation
    ↓
Response (JSON)
```

**Feature Engineering:**
- **BMI Calculation:** `weight / (height/100)^2`
- **Age Groups:** Categorical bins (0-30, 30-40, 40-50, 50-60, 60+)
- **Pulse Pressure:** `systolic_bp - diastolic_bp`
- **Interaction Features:**
  - `age × systolic_bp`
  - `glucose × BMI`

**Model Output:**
```json
{
  "risk_probability": 0.2345,
  "risk_category": "Low Risk",
  "confidence_interval": [0.2245, 0.2445],
  "top_risk_factors": [
    {"feature": "age", "impact": 0.0523},
    {"feature": "ap_hi", "impact": 0.0412},
    {"feature": "bmi", "impact": 0.0301}
  ],
  "recommendation": "Consult cardiology specialist if high risk."
}
```

---

## Data Flow Architecture

### Prediction Creation Flow

```
1. User Login (Frontend)
   ↓
2. JWT Token Stored in Cookie/LocalStorage
   ↓
3. User Enters Patient Data (11 parameters)
   ↓
4. POST /api/predictions (Backend)
   ↓
5. JWT Verification Middleware
   ↓
6. Input Validation (Joi Schema)
   ↓
7. Create Visit Record (MongoDB)
   ↓
8. Call ML Service (Axios HTTP)
   ↓
9. ML Service: Feature Engineering
   ↓
10. ML Service: Prediction + SHAP
   ↓
11. Backend: Save Report (MongoDB)
   ↓
12. Backend: Update Visit Status
   ↓
13. Return Complete Data to Frontend
   ↓
14. Frontend: Display Risk Dashboard
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Visits Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  patientData: {
    age: Number,
    height: Number,
    weight: Number,
    gender: Number (0/1),
    ap_hi: Number,
    ap_lo: Number,
    cholesterol: Number (1/2/3),
    gluc: Number (1/2/3),
    smoke: Number (0/1),
    alco: Number (0/1),
    active: Number (0/1)
  },
  status: String (enum: ['pending', 'completed', 'failed']),
  reportId: ObjectId (ref: Report),
  createdAt: Date,
  updatedAt: Date
}
```

### Reports Collection
```javascript
{
  _id: ObjectId,
  visitId: ObjectId (ref: Visit, indexed),
  userId: ObjectId (ref: User, indexed),
  prediction: {
    risk_probability: Number,
    risk_category: String,
    confidence_interval: [Number, Number],
    top_risk_factors: [{
      feature: String,
      impact: Number
    }],
    recommendation: String
  },
  mlResponse: Mixed (raw ML output),
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `users.email`: Unique index
- `visits.userId` + `visits.createdAt`: Compound index
- `reports.userId` + `reports.createdAt`: Compound index
- `reports.prediction.risk_category`: Single index

---

## Communication Protocols

### Frontend ↔ Backend
- **Protocol:** HTTPS/REST
- **Format:** JSON
- **Authentication:** JWT (Bearer Token or HTTP-only Cookie)
- **CORS:** Configured for `http://localhost:5173`

### Backend ↔ Database
- **Protocol:** MongoDB Wire Protocol
- **Connection:** MongoDB Atlas (Cloud) via connection string
- **Security:** TLS/SSL encryption, IP whitelisting

### Backend ↔ ML Service
- **Protocol:** HTTP/REST
- **Format:** JSON
- **Timeout:** 30 seconds
- **Error Handling:** Retry logic, fallback responses

---

## Security Architecture

### Authentication Flow
```
1. User registers → Password hashed (bcrypt, 10 rounds)
2. Email verification token sent
3. User verifies email → isEmailVerified = true
4. User logs in → JWT token generated (7-day expiry)
5. Token stored in HTTP-only cookie + localStorage
6. Every request → JWT verified via middleware
7. Token expired → User must re-login
```

### Security Layers
1. **Transport Layer:** HTTPS (production)
2. **Application Layer:**
   - Helmet.js (security headers)
   - CORS (origin whitelisting)
   - Rate limiting (100 requests/15 min)
   - Input sanitization (MongoDB injection prevention)
3. **Data Layer:**
   - Password hashing (bcrypt)
   - JWT token encryption
   - Environment variables (.env)

---

## Scalability Considerations

### Horizontal Scaling
- **Frontend:** CDN deployment (Vercel, Netlify)
- **Backend:** Multiple Node.js instances behind load balancer
- **ML Service:** Container orchestration (Docker + Kubernetes)
- **Database:** MongoDB Atlas auto-scaling



---

## Deployment Architecture

### Development Environment
```
Frontend:  localhost:5173 (Vite dev server)
Backend:   localhost:5000 (Node.js)
ML Service: localhost:8000 (Uvicorn)
Database:  MongoDB Atlas (Cloud)
```



---

## Error Handling Strategy

### Frontend
- User-friendly error messages
- Input validation before submission
- Network error handling (offline detection)

### Backend
- Global error handler middleware
- Structured error responses
- Detailed logging (Winston)
- Error codes (400, 401, 404, 500, 503)

### ML Service
- Input validation (Pydantic models)
- Model loading failure handling
- Feature engineering error recovery

---

## Monitoring & Logging

### Backend Logging (Winston)
```javascript
{
  level: 'info',
  timestamp: '2026-02-22T10:30:00Z',
  userId: '60d5ec49f1b2c72b8c8e4f1b',
  action: 'prediction_created',
  metadata: {
    visitId: '...',
    riskCategory: 'Low Risk'
  }
}
```

### Log Levels
- **Error:** System failures, ML service unavailable
- **Warn:** Invalid inputs, rate limit exceeded
- **Info:** Successful operations, user actions
- **Debug:** Detailed execution flow (development)

### Log Storage
- Development: Console + `logs/` directory
- Production: Winston Daily Rotate Files + Cloud logging (AWS CloudWatch, etc.)

---

## Technology Decision Rationale

| Technology | Reason |
|------------|--------|
| React | Component reusability, large ecosystem |
| Vite | Fast build times, HMR |
| Tailwind CSS | Utility-first, rapid prototyping |
| Node.js + Express | JavaScript full-stack, large community |
| MongoDB | Flexible schema, easy scaling |
| FastAPI | High performance, automatic docs |
| XGBoost | Best performance for tabular data |
| SHAP | Industry-standard explainability |
| JWT | Stateless authentication |
| Winston | Production-grade logging |

---

## Future Enhancements

1. **Redis Caching** for faster report retrieval
2. **GraphQL API** for flexible queries
3. **WebSocket** for real-time updates
4. **Docker Containerization** for easy deployment
5. **CI/CD Pipeline** (GitHub Actions)
6. **Automated Testing** (Jest, Pytest)
7. **API Rate Limiting per User** (advanced throttling)
8. **Multi-language Support** (i18n)

---

## Conclusion

CardioShield AI follows industry-standard architectural patterns with clear separation of concerns, scalability, and security at its core. The microservices approach allows independent scaling and maintenance of each layer while maintaining loose coupling through well-defined APIs.
