# CardioShield AI

**AI-Powered Early Cardiovascular Risk Stratification Platform**

> An explainable, low-cost, deployable AI platform designed for early prediction of cardiovascular diseases (CVD) -- specifically heart attacks and strokes -- in underserved and resource-constrained populations.

**Live Demo:** [https://cardioshield.onrender.com](https://cardioshield.onrender.com) *(deployed on Render)*

---

## Team Members & Roles

| Name | Role | GitHub | Contributions |
|------|------|--------|---------------|
| **Arpit Garg** | ML Engineer & Team Lead | [@arpitgarg123](https://github.com/arpitgarg123) | ML model training, FastAPI service, SHAP explainability, feature engineering |
| **Fareha** | Backend Developer | [@ifareha](https://github.com/ifareha) | Node.js/Express API, MongoDB schemas, authentication, documentation |
| **Anshu** | Frontend Developer | [@Anshu8435](https://github.com/Anshu8435) | React UI, dashboard, patient forms, result visualization |
| **Rishabh Malviya** | Full-Stack Support | [@RishabhMalviya](https://github.com/RishabhMalviya) | Integration, testing, deployment configuration |

---

## Problem Statement

Cardiovascular diseases (CVD) are the leading cause of death globally, accounting for **17.9 million deaths annually** (WHO). In rural and low-income areas, early screening facilities are extremely limited.

**Key Challenges:**
- Late detection -- most CVD cases are diagnosed after symptoms appear
- High-risk patients are frequently missed (false negatives)
- Expensive diagnostic tools (ECG, angiography) are inaccessible to the majority
- Bias in existing risk models for South Asian populations

CardioShield AI addresses these challenges through a **low-cost, explainable, and deployable AI solution** following a structured health intelligence loop:

```
Input -> Clean -> Engineer -> Predict -> Calibrate -> Explain -> Stratify -> Act
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Router 7, Axios, jsPDF, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose 8), JWT Authentication, Winston Logger, Joi Validation |
| **ML Service** | Python, FastAPI, XGBoost, LightGBM, scikit-learn, SHAP, Pandas, NumPy, SMOTE (imbalanced-learn) |
| **Database** | MongoDB Atlas (Cloud) |
| **Deployment** | Render (Backend + ML Service), Vercel-ready (Frontend) |
| **Version Control** | Git, GitHub (branching: main, dev, feature branches) |

---

## Installation Steps

### Prerequisites
- Node.js >= 18.0.0
- Python >= 3.10
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Anshu8435/NavKalpana-RICR-NK-0001.git
cd NavKalpana-RICR-NK-0001
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
Start the backend:
```bash
npm run dev
```

### 3. ML Server Setup
```bash
cd ml_server
python -m venv myvenv
# Windows
myvenv\Scripts\activate
# macOS/Linux
# source myvenv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| GET | `/api/auth/verify-email/:token` | Verify email address | No |
| POST | `/api/auth/login` | Login & get JWT token | No |
| POST | `/api/auth/resend-verification` | Resend verification email | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password/:token` | Reset password | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Predictions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/predictions` | Create new risk prediction | Yes |
| GET | `/api/predictions/reports` | Get all user reports (paginated) | Yes |
| GET | `/api/predictions/reports/:reportId` | Get single report | Yes |
| GET | `/api/predictions/statistics` | Get user statistics & analytics | Yes |
| DELETE | `/api/predictions/reports/:reportId` | Delete a report | Yes |
| GET | `/api/predictions/health` | Test ML service connection | Yes |

### ML Service (FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Run cardiovascular risk prediction |
| GET | `/health` | ML server health check |

---

## System Architecture

```
+---------------------------------------------------------------+
|               Frontend (React + Vite + Tailwind)               |
|  Authentication UI | Patient Forms | Risk Dashboard            |
|  SHAP Visualization | PDF Reports | Record History              |
+-----------------------------+---------------------------------+
                              | REST API (HTTPS)
+-----------------------------v---------------------------------+
|            Backend (Node.js + Express, Port 5000)              |
|  +-------------+  +------------------+  +----------------+    |
|  | Auth Module  |  | Prediction Module|  | Shared Utils   |    |
|  +-------------+  +------------------+  +----------------+    |
|  Middleware: JWT Auth, Joi Validation, Rate Limit, Helmet      |
+----------+----------------------------+-----------------------+
           |                            |
    MongoDB Atlas                  FastAPI ML Service
    (Users, Visits, Reports)       (Port 8000)
                                        |
                                +-------v--------+
                                | XGBoost Model  |
                                | SHAP Explainer |
                                | Feature Engine |
                                | Recommendation |
                                +----------------+
```

---

## ML Model Details

### Models Trained & Compared

| Model | ROC-AUC | Recall | Precision | PR-AUC |
|-------|---------|--------|-----------|--------|
| **XGBoost (Calibrated)** | 0.782 | 84.7% | 71.5% | 0.765 |
| LightGBM | 0.775 | 83.2% | 70.8% | 0.758 |
| Neural Network (MLP) | 0.760 | 81.5% | 69.2% | 0.740 |
| TabNet | 0.755 | 80.1% | 68.5% | 0.732 |
| Ensemble (Voting) | 0.778 | 83.9% | 71.0% | 0.761 |

**Deployed Model:** XGBoost with Isotonic Calibration (best recall + AUC combination)

### Performance vs PDF Targets

The PDF specified aspirational targets of ROC-AUC >= 0.92 and Recall >= 0.85. Our actual results are:
- **ROC-AUC 0.782** -- This is within industry norms (0.75-0.80) for this specific dataset (70,000 samples with 11 low-cost clinical features). Reaching 0.92 would require advanced biomarkers (LDL/HDL, troponin, CRP) not available in low-cost screening settings.
- **Recall 84.7%** -- Very close to the 85% target and significantly above the 75-80% industry benchmark. This ensures minimal false negatives.
- **Why this trade-off?** -- Achieving higher AUC with only basic vitals is constrained by the inherent information content of the features. Our model extracts maximum predictive value from low-cost inputs, making it practical for deployment in resource-constrained rural clinics where expensive tests are unavailable.

### Feature Engineering
- **BMI** = weight / (height/100)^2
- **Pulse Pressure** = Systolic BP - Diastolic BP
- **Age x BP Interaction** = age x systolic BP
- **Glucose x BMI Interaction** = glucose level x BMI

### Explainability
- **SHAP Values** for every individual prediction
- **Counterfactual Explanations** (e.g., "If your BP was 120 instead of 160, risk would drop to Low")
- **Global Feature Importance** via SHAP summary

### Bias & Fairness Analysis
- False Negative Rate evaluated across Gender, Age Group, BMI Group
- Disparate Impact Ratio measured
- Equalized Odds computed per subgroup
- Threshold-based bias mitigation applied (gender-aware threshold adjustment)

---

## Screenshots

> Screenshots are available in the `docs/screenshots/` directory and in the presentation.

### Key Screens
1. **Landing Page** -- Informational page with features, stats, and how-it-works
2. **Login / Signup** -- JWT-based authentication with email verification
3. **Dashboard** -- Statistics overview with total patients, risk distribution, recent assessments
4. **Patient Registration** -- Register patients with auto-generated IDs
5. **Health Analysis Form** -- 11-field input with dropdowns and sliders for clinical data
6. **Risk Result Dashboard** -- Risk score, SHAP explainability chart, top risk factors, counterfactual insights
7. **AI Recommendations** -- Personalized health recommendations with severity coding
8. **Patient Records** -- Searchable, filterable history with PDF export
9. **PDF Report** -- Downloadable comprehensive risk assessment report


## Key Features

- **JWT Authentication** with email verification, password reset, and account lockout
- **AI Risk Prediction** using calibrated XGBoost model (5-10 year CVD risk)
- **SHAP Explainability** -- top risk factors with impact scores for every prediction
- **Counterfactual Explanations** -- actionable "what-if" scenarios
- **Personalized Recommendations** -- clinically relevant health advice per risk factor
- **Referral Suggestions** -- specialist referral based on risk severity
- **PDF Report Generation** -- downloadable patient risk reports
- **Patient Records** -- searchable history with filtering and export
- **Clinical Dashboard** -- statistics, risk distribution, and recent assessments
- **Bias & Fairness Audit** -- FNR by subgroup, disparate impact, equalized odds
- **Security** -- Helmet, CORS, rate limiting, MongoDB sanitization, bcrypt hashing
- **Responsive UI** -- Mobile-friendly design for rural health worker usage
- **Production Logging** -- Winston with daily rotate files

---

## Future Improvements

1. **Ensemble Deployment** -- Deploy combined XGBoost + LightGBM + Neural Network model for improved accuracy
2. **Regional Calibration** -- South Asian-specific model with population-adjusted thresholds
3. **PWA / Offline Mode** -- Service worker for offline-capable deployment in rural settings
4. **Wearable Integration** -- Real-time data from Fitbit, Apple Watch for continuous monitoring
5. **Advanced Biomarkers** -- LDL/HDL cholesterol, HbA1c, CRP for improved prediction
6. **Multi-language Support** -- Hindi, regional languages for rural health workers
7. **Role-based Access Control** -- Admin, Doctor, and Health Worker roles with different permissions
8. **Clinical Validation Study** -- 5-year prospective follow-up with partner hospitals
9. **Mobile App** -- Native iOS/Android apps for field screening
10. **FDA/CE Regulatory Approval** -- Pursue medical device certification

---


