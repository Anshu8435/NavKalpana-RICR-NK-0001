# CardioShield AI - API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000`  
**API Prefix:** `/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Prediction Endpoints](#prediction-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Examples](#examples)

---

## Authentication

CardioShield AI uses **JWT (JSON Web Token)** based authentication. Tokens are valid for 7 days.

### Including Authentication Token

**Option 1: Authorization Header (Recommended)**
```http
Authorization: Bearer <your_jwt_token>
```

**Option 2: Cookie (Automatic)**
```http
Cookie: token=<your_jwt_token>
```

### Token Lifecycle

1. **Obtain Token:** Call `POST /api/auth/login`
2. **Use Token:** Include in requests to protected endpoints
3. **Token Expiry:** 7 days (configurable via `JWT_EXPIRES_IN`)
4. **Refresh:** Re-login when expired

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`  
**Auth Required:** No

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Validation Rules:**
- `firstName`: 2-50 characters, alphabetic
- `lastName`: 2-50 characters, alphabetic
- `email`: Valid email format, unique
- `password`: Minimum 6 characters
- `confirmPassword`: Must match password

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isEmailVerified": false,
      "createdAt": "2026-02-22T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400`: Validation error
- `409`: Email already registered

---

### 2. Login User

Authenticate and obtain JWT token.

**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isEmailVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `404`: User not found

---

### 3. Verify Email

Verify user email address using token sent via email.

**Endpoint:** `GET /api/auth/verify-email/:token`  
**Auth Required:** No

**URL Parameters:**
- `token`: Email verification token (from email link)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now login."
}
```

**Error Responses:**
- `400`: Invalid or expired token

---

### 4. Get User Profile

Retrieve authenticated user's profile information.

**Endpoint:** `GET /api/auth/profile`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isEmailVerified": true,
    "createdAt": "2026-02-22T10:30:00.000Z"
  }
}
```

---

### 5. Logout User

Logout and clear authentication token.

**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 6. Forgot Password

Request password reset email.

**Endpoint:** `POST /api/auth/forgot-password`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 7. Reset Password

Reset password using token from email.

**Endpoint:** `POST /api/auth/reset-password/:token`  
**Auth Required:** No

**URL Parameters:**
- `token`: Password reset token (from email link)

**Request Body:**
```json
{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Prediction Endpoints

### 1. Create Prediction

Generate cardiovascular risk prediction for a patient.

**Endpoint:** `POST /api/predictions`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "age": 45,
  "height": 170,
  "weight": 75,
  "gender": 1,
  "ap_hi": 120,
  "ap_lo": 80,
  "cholesterol": 1,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1
}
```

**Field Descriptions:**

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| age | Number | 1-120 | Patient age in years |
| height | Number | 50-300 | Height in centimeters |
| weight | Number | 10-500 | Weight in kilograms |
| gender | Number | 0 or 1 | 0 = Female, 1 = Male |
| ap_hi | Number | 70-250 | Systolic blood pressure (mmHg) |
| ap_lo | Number | 40-200 | Diastolic blood pressure (mmHg) |
| cholesterol | Number | 1, 2, or 3 | 1 = Normal, 2 = Above Normal, 3 = Well Above Normal |
| gluc | Number | 1, 2, or 3 | Glucose level - 1 = Normal, 2 = Above Normal, 3 = Well Above Normal |
| smoke | Number | 0 or 1 | Smoking status - 0 = No, 1 = Yes |
| alco | Number | 0 or 1 | Alcohol consumption - 0 = No, 1 = Yes |
| active | Number | 0 or 1 | Physical activity - 0 = No, 1 = Yes |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Prediction completed successfully",
  "data": {
    "visit": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "userId": "60d5ec49f1b2c72b8c8e4f1b",
      "patientData": {
        "age": 45,
        "height": 170,
        "weight": 75,
        "gender": 1,
        "ap_hi": 120,
        "ap_lo": 80,
        "cholesterol": 1,
        "gluc": 1,
        "smoke": 0,
        "alco": 0,
        "active": 1
      },
      "status": "completed",
      "reportId": "60d5ec49f1b2c72b8c8e4f1c",
      "createdAt": "2026-02-22T10:30:00.000Z",
      "updatedAt": "2026-02-22T10:30:05.000Z"
    },
    "report": {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "visitId": "60d5ec49f1b2c72b8c8e4f1a",
      "userId": "60d5ec49f1b2c72b8c8e4f1b",
      "prediction": {
        "risk_probability": 0.2345,
        "risk_category": "Low Risk",
        "confidence_interval": [0.2245, 0.2445],
        "top_risk_factors": [
          {
            "feature": "age",
            "impact": 0.0523
          },
          {
            "feature": "ap_hi",
            "impact": 0.0412
          },
          {
            "feature": "bmi",
            "impact": 0.0301
          }
        ],
        "recommendation": "Consult cardiology specialist if high risk."
      },
      "processedAt": "2026-02-22T10:30:05.000Z",
      "createdAt": "2026-02-22T10:30:05.000Z"
    }
  }
}
```

**Error Responses:**
- `400`: Validation error (invalid input)
- `401`: Unauthorized (not logged in)
- `500`: Server error
- `503`: ML Service unavailable

---

### 2. Get All User Reports

Retrieve all prediction reports for authenticated user with pagination and filtering.

**Endpoint:** `GET /api/predictions/reports`  
**Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Number | 1 | Page number |
| limit | Number | 10 | Results per page (max: 100) |
| sortBy | String | createdAt | Sort field: `createdAt`, `risk_probability`, `risk_category` |
| order | String | desc | Sort order: `asc` or `desc` |
| riskCategory | String | - | Filter by: `Low Risk`, `Moderate Risk`, `High Risk` |

**Example Request:**
```
GET /api/predictions/reports?page=1&limit=10&riskCategory=High%20Risk&sortBy=createdAt&order=desc
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reports retrieved successfully",
  "data": {
    "reports": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1c",
        "visitId": {
          "_id": "60d5ec49f1b2c72b8c8e4f1a",
          "patientData": {
            "age": 45,
            "height": 170,
            "weight": 75,
            "gender": 1,
            "ap_hi": 120,
            "ap_lo": 80,
            "cholesterol": 1,
            "gluc": 1,
            "smoke": 0,
            "alco": 0,
            "active": 1
          },
          "createdAt": "2026-02-22T10:30:00.000Z"
        },
        "prediction": {
          "risk_probability": 0.2345,
          "risk_category": "Low Risk",
          "confidence_interval": [0.2245, 0.2445],
          "top_risk_factors": [
            {"feature": "age", "impact": 0.0523},
            {"feature": "ap_hi", "impact": 0.0412},
            {"feature": "bmi", "impact": 0.0301}
          ],
          "recommendation": "Consult cardiology specialist if high risk."
        },
        "createdAt": "2026-02-22T10:30:05.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalReports": 48,
      "hasMore": true
    }
  }
}
```

---

### 3. Get Specific Report

Retrieve a single prediction report by ID.

**Endpoint:** `GET /api/predictions/reports/:reportId`  
**Auth Required:** Yes

**URL Parameters:**
- `reportId`: MongoDB ObjectId of the report

**Example Request:**
```
GET /api/predictions/reports/60d5ec49f1b2c72b8c8e4f1c
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Report retrieved successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "visitId": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "patientData": {
        "age": 45,
        "height": 170,
        "weight": 75,
        "gender": 1,
        "ap_hi": 120,
        "ap_lo": 80,
        "cholesterol": 1,
        "gluc": 1,
        "smoke": 0,
        "alco": 0,
        "active": 1
      },
      "createdAt": "2026-02-22T10:30:00.000Z"
    },
    "prediction": {
      "risk_probability": 0.2345,
      "risk_category": "Low Risk",
      "confidence_interval": [0.2245, 0.2445],
      "top_risk_factors": [
        {"feature": "age", "impact": 0.0523},
        {"feature": "ap_hi", "impact": 0.0412},
        {"feature": "bmi", "impact": 0.0301}
      ],
      "recommendation": "Consult cardiology specialist if high risk."
    },
    "processedAt": "2026-02-22T10:30:05.000Z",
    "createdAt": "2026-02-22T10:30:05.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid report ID format
- `404`: Report not found
- `401`: Unauthorized

---

### 4. Get User Statistics

Retrieve aggregated statistics for the authenticated user.

**Endpoint:** `GET /api/predictions/statistics`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalReports": 48,
    "riskDistribution": {
      "Low Risk": 32,
      "Moderate Risk": 12,
      "High Risk": 4
    },
    "recentReports": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1c",
        "prediction": {
          "risk_category": "Low Risk",
          "risk_probability": 0.2345
        },
        "createdAt": "2026-02-22T10:30:05.000Z",
        "visitId": {
          "_id": "60d5ec49f1b2c72b8c8e4f1a",
          "patientData": {
            "age": 45,
            "gender": 1
          },
          "createdAt": "2026-02-22T10:30:00.000Z"
        }
      }
    ]
  }
}
```

---

### 5. Delete Report

Delete a prediction report and its associated visit.

**Endpoint:** `DELETE /api/predictions/reports/:reportId`  
**Auth Required:** Yes

**URL Parameters:**
- `reportId`: MongoDB ObjectId of the report

**Success Response (200):**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

**Error Responses:**
- `400`: Invalid report ID
- `404`: Report not found
- `401`: Unauthorized

---

### 6. ML Service Health Check

Check if the ML service is reachable and functioning.

**Endpoint:** `GET /api/predictions/health`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "ML service is reachable",
  "mlServiceUrl": "http://localhost:8000",
  "mlResponse": {
    "message": "Welcome to the ML Server API!"
  }
}
```

**Error Response (503):**
```json
{
  "success": false,
  "message": "ML service is not reachable",
  "error": "connect ECONNREFUSED 127.0.0.1:8000"
}
```

---

## Error Handling

All API endpoints return errors in a consistent format:

### Error Response Structure

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or malformed request |
| 401 | Unauthorized | Authentication required or invalid token |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | ML service not responding |

### Common Error Examples

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "age",
      "message": "Age must be at least 1"
    },
    {
      "field": "ap_lo",
      "message": "Diastolic BP must be less than Systolic BP"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Not authorized, please login"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Report not found"
}
```

**ML Service Error (503):**
```json
{
  "success": false,
  "message": "ML Service is not responding. Please try again later."
}
```

---

## Rate Limiting

To prevent abuse, the API implements rate limiting:

**Limits:**
- **General API:** 100 requests per 15 minutes per IP address
- **Authentication endpoints:** May have stricter limits

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645519800
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "retryAfter": 900
}
```

---

## Examples

### Complete Workflow Example (cURL)

#### Step 1: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

#### Step 2: Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

**Save the token from response:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Step 3: Create Prediction
```bash
curl -X POST http://localhost:5000/api/predictions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "age": 45,
    "height": 170,
    "weight": 75,
    "gender": 1,
    "ap_hi": 120,
    "ap_lo": 80,
    "cholesterol": 1,
    "gluc": 1,
    "smoke": 0,
    "alco": 0,
    "active": 1
  }'
```

#### Step 4: Get User Reports
```bash
curl -X GET "http://localhost:5000/api/predictions/reports?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 5: Get Statistics
```bash
curl -X GET http://localhost:5000/api/predictions/statistics \
  -H "Authorization: Bearer $TOKEN"
```

---

### JavaScript (Axios) Example

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Login and get token
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    const token = response.data.data.token;
    
    // Store token
    localStorage.setItem('token', token);
    
    return token;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};

// Create prediction
const createPrediction = async (patientData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_BASE_URL}/predictions`,
      patientData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Prediction error:', error.response.data);
    throw error;
  }
};

// Usage
(async () => {
  // Login
  await login('john.doe@example.com', 'SecurePass123!');
  
  // Create prediction
  const result = await createPrediction({
    age: 45,
    height: 170,
    weight: 75,
    gender: 1,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1
  });
  
  console.log('Risk Category:', result.report.prediction.risk_category);
  console.log('Risk Probability:', result.report.prediction.risk_probability);
})();
```

---

### Python (Requests) Example

```python
import requests

API_BASE_URL = 'http://localhost:5000/api'

# Login
def login(email, password):
    response = requests.post(
        f'{API_BASE_URL}/auth/login',
        json={'email': email, 'password': password}
    )
    response.raise_for_status()
    return response.json()['data']['token']

# Create prediction
def create_prediction(token, patient_data):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(
        f'{API_BASE_URL}/predictions',
        json=patient_data,
        headers=headers
    )
    response.raise_for_status()
    return response.json()['data']

# Usage
token = login('john.doe@example.com', 'SecurePass123!')

patient_data = {
    'age': 45,
    'height': 170,
    'weight': 75,
    'gender': 1,
    'ap_hi': 120,
    'ap_lo': 80,
    'cholesterol': 1,
    'gluc': 1,
    'smoke': 0,
    'alco': 0,
    'active': 1
}

result = create_prediction(token, patient_data)
print(f"Risk Category: {result['report']['prediction']['risk_category']}")
print(f"Risk Probability: {result['report']['prediction']['risk_probability']}")
```

---

## API Testing Tools

### Postman Collection

A Postman collection is available at:
```
backend/CardioShield-API.postman_collection.json
```

Import this into Postman for easy testing of all endpoints.

### Swagger/OpenAPI

Future enhancement: Interactive API documentation via Swagger UI.

---

## Support & Contact

For API issues or questions:
- **Email:** support@cardioshield.ai
- **Documentation:** [/docs](../docs)
- **GitHub Issues:** [Project Repository](https://github.com/your-repo)

---

**Last Updated:** February 22, 2026  
**API Version:** 1.0.0
