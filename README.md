# CardioShield AI - Early Cardiovascular Risk Prediction Platform

CardioShield AI is a software-based platform that uses Artificial Intelligence and Machine Learning to predict cardiovascular disease risk. By analyzing medical and lifestyle data, it provides early detection and personalized recommendations, helping healthcare professionals and individuals make informed, preventive health decisions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12
- MongoDB Atlas account (or local MongoDB)

### Installation & Setup

#### 1. Backend Server
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
# Runs on http://localhost:5000
```

#### 2. ML Server
```bash
cd ml_server
.\myvenv\Scripts\activate  # Windows
# source myvenv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

#### 3. Frontend
```bash
cd frontend
npm install
# .env already configured with VITE_API_URL=http://localhost:5000/api
npm run dev
# Runs on http://localhost:5173
```

### 🎯 Testing the Application
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete testing procedures.

**Quick Test Flow:**
1. Visit `http://localhost:5173`
2. Click "Get Started" → Create doctor account
3. Login → Register a patient
4. Fill health screening form
5. View prediction results

---

## 📖 Documentation
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete setup, testing, and troubleshooting
- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Technical integration details
- **[PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)** - Gap analysis vs hackathon requirements
- **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** - Quick reference and statistics

---

## -NavKalpana-RICR-NK-0001-



# -Project Summary – CardioShield AI

CardioShield AI ek AI-powered Early Cardiovascular Risk Stratification Platform hai jo 5–10 saal ke andar heart attack aur stroke ke risk ko predict karta hai, specially underserved aur rural populations ke liye.

Ye system diagnosis replace nahi karta, balki ek early-warning decision support tool hai jo primary health centers aur community health workers ko timely intervention lene me help karta hai.

🎯 Problem Statement

Cardiovascular diseases (CVD) duniya bhar me sabse zyada deaths ka reason hain, aur rural & low-income areas me early screening facilities limited hoti hain.

Major challenges:

Late detection

High-risk patients ka miss ho jana (false negatives)

Expensive diagnostic tools

South Asian population me bias issues

CardioShield AI in problems ko solve karta hai ek low-cost, explainable, deployable AI solution ke through.

💡 Proposed Solution

CardioShield AI ek structured AI health intelligence loop follow karta hai:

Input → Clean → Engineer → Predict → Calibrate → Explain → Stratify → Act

System:

Low-cost clinical inputs leta hai (BP, BMI, glucose, etc.)

Data clean aur preprocess karta hai

Multiple ML models train karta hai

Risk probability calculate karta hai

Explainable AI (SHAP) se reason batata hai

Patient ko Low / Moderate / High risk category me classify karta hai

🏗 System Architecture
🔹 PART 1 – Core Risk Stratification Engine (70%)

Data Preprocessing Engine

Feature Engineering

Model Training (XGBoost, LightGBM, Neural Network, TabNet, Ensemble)

Probability Calibration

Risk Categorization

Explainability Engine

🔹 PART 2 – Clinical Intelligence & Deployment Layer (30%)

Bias-aware calibration (South Asian focus)

Offline-capable rural deployment

Clinical dashboard

Ethical AI considerations

📊 Input Features (Low-Cost Screening)

System sirf basic clinical inputs use karta hai:

Age

Height

Weight

Gender

Systolic & Diastolic BP

Cholesterol

Glucose

Smoking

Alcohol

Physical Activity

Target Variable: Presence of cardiovascular disease

🧠 Feature Engineering

Advanced derived features:

BMI categories

Pulse pressure (SBP − DBP)

Age × BP interaction

Glucose × BMI interaction

Composite risk indices

Ye transformations clinically aligned hain.

🤖 Model Development

Multiple models train aur compare kiye gaye:

XGBoost

LightGBM

Neural Network

TabNet

Ensemble Model

Performance Targets:

ROC-AUC ≥ 0.92

Recall ≥ 0.85 (False negatives avoid karne ke liye)

Precision ≥ 0.80

Strong PR-AUC

Recall ko accuracy se zyada prioritize kiya gaya kyunki high-risk patient miss hona life-threatening ho sakta hai.

📈 Calibration & Risk Output

Raw probability ko:

Platt Scaling

Isotonic Regression

se calibrate kiya gaya.

Final output:

5–10 year risk probability

Risk category (Low / Moderate / High)

Confidence interval

Top contributing risk factors

🔍 Explainable AI (Mandatory Component)
Global Explainability:

Feature Importance

SHAP summary plots

Individual Explanation:

System clearly batata hai:

“High systolic BP (+32%), elevated glucose (+18%), and smoking (+12%) significantly increase predicted risk.”

Isse clinicians ko transparent reasoning milti hai.

🖥 Clinical Dashboard

Dashboard show karta hai:

Risk Score

Risk Category

Top Risk Drivers

Preventive Recommendations

Referral Suggestion

Simple aur clean UI rural health settings ke liye design ki gayi hai.

🚀 Impact

CardioShield AI:

Early detection enable karta hai

Rural screening improve karta hai

Bias-aware decision support deta hai

Low-cost inputs se scalable solution provide karta hai

Government & insurance screening me use ho sakta hai