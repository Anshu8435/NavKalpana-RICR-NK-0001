"""
Personalized recommendation engine for CardioShield AI.
Generates actionable health recommendations based on:
  - Risk category (Low / Moderate / High)
  - Patient vitals (BP, cholesterol, glucose, BMI, lifestyle)
  - Top SHAP risk factors
"""


def _bp_recommendations(ap_hi: float, ap_lo: float):
    """Blood pressure based recommendations."""
    recs = []
    if ap_hi >= 140 or ap_lo >= 90:
        recs.append({
            "category": "Blood Pressure",
            "severity": "high",
            "title": "High Blood Pressure Detected",
            "description": "Your blood pressure is elevated. Uncontrolled hypertension significantly increases cardiovascular risk.",
            "actions": [
                "Reduce sodium intake to less than 1500 mg/day",
                "Follow the DASH diet (rich in fruits, vegetables, whole grains)",
                "Monitor blood pressure at home twice daily",
                "Consult your doctor about antihypertensive medication",
                "Practice stress-reducing techniques like meditation or deep breathing",
            ],
        })
    elif ap_hi >= 120 or ap_lo >= 80:
        recs.append({
            "category": "Blood Pressure",
            "severity": "moderate",
            "title": "Pre-Hypertension Warning",
            "description": "Your blood pressure is in the pre-hypertension range. Lifestyle changes can prevent it from worsening.",
            "actions": [
                "Limit sodium to under 2300 mg/day",
                "Increase potassium-rich foods (bananas, spinach, sweet potatoes)",
                "Engage in 30 minutes of moderate exercise 5 days a week",
                "Maintain a healthy weight",
            ],
        })
    return recs


def _cholesterol_recommendations(cholesterol: int):
    """Cholesterol level based recommendations."""
    recs = []
    if cholesterol == 3:
        recs.append({
            "category": "Cholesterol",
            "severity": "high",
            "title": "High Cholesterol Level",
            "description": "High cholesterol increases plaque buildup in arteries, raising the risk of heart attack and stroke.",
            "actions": [
                "Reduce saturated fat intake (limit red meat, full-fat dairy)",
                "Increase soluble fiber (oats, beans, lentils, fruits)",
                "Add omega-3 fatty acids (fatty fish, walnuts, flaxseeds)",
                "Consult your doctor about statin therapy",
                "Get a lipid panel test every 3-6 months",
            ],
        })
    elif cholesterol == 2:
        recs.append({
            "category": "Cholesterol",
            "severity": "moderate",
            "title": "Above Normal Cholesterol",
            "description": "Your cholesterol is above normal. Dietary changes can help bring it under control.",
            "actions": [
                "Replace saturated fats with healthy fats (olive oil, avocado)",
                "Eat more fiber-rich foods",
                "Exercise regularly to raise HDL (good cholesterol)",
                "Consider annual lipid panel monitoring",
            ],
        })
    return recs


def _glucose_recommendations(gluc: int):
    """Glucose level based recommendations."""
    recs = []
    if gluc == 3:
        recs.append({
            "category": "Blood Sugar",
            "severity": "high",
            "title": "High Blood Glucose",
            "description": "Elevated glucose levels increase cardiovascular risk and may indicate diabetes or pre-diabetes.",
            "actions": [
                "Limit refined carbohydrates and sugary foods/drinks",
                "Get an HbA1c test to assess long-term glucose control",
                "Monitor blood sugar levels regularly",
                "Follow a low-glycemic index diet",
                "Consult an endocrinologist for further evaluation",
            ],
        })
    elif gluc == 2:
        recs.append({
            "category": "Blood Sugar",
            "severity": "moderate",
            "title": "Above Normal Blood Glucose",
            "description": "Your glucose is above normal range. Early intervention can prevent progression to diabetes.",
            "actions": [
                "Reduce sugar and processed carbohydrate consumption",
                "Include more whole grains, vegetables, and lean protein",
                "Stay physically active – at least 150 min/week of moderate exercise",
                "Schedule a fasting blood sugar test annually",
            ],
        })
    return recs


def _bmi_recommendations(weight: float, height: float):
    """BMI based recommendations."""
    recs = []
    if height <= 0:
        return recs
    bmi = weight / ((height / 100) ** 2)
    if bmi >= 30:
        recs.append({
            "category": "Weight Management",
            "severity": "high",
            "title": "Obesity Detected",
            "description": f"Your BMI is {bmi:.1f}, indicating obesity. This significantly raises cardiovascular risk.",
            "actions": [
                "Work with a nutritionist to create a calorie-deficit meal plan",
                "Aim for gradual weight loss of 0.5-1 kg per week",
                "Incorporate both cardio and strength training exercises",
                "Consider a medically supervised weight management program",
                "Avoid crash diets; focus on sustainable lifestyle changes",
            ],
        })
    elif bmi >= 25:
        recs.append({
            "category": "Weight Management",
          
            "severity": "moderate",
            "title": "Overweight",
            "description": f"Your BMI is {bmi:.1f}, which is in the overweight range. Maintaining a healthy weight reduces heart disease risk.",
            "actions": [
                "Aim for 30-45 minutes of exercise most days of the week",
                "Practice portion control and mindful eating",
                "Increase vegetable and fruit intake",
                "Reduce calorie-dense, low-nutrient foods",
            ],
        })
    return recs


def _smoking_recommendations(smoke: int):
    """Smoking based recommendations."""
    recs = []
    if smoke == 1:
        recs.append({
            "category": "Smoking",
      
            "severity": "high",
            "title": "Smoking – Major Risk Factor",
            "description": "Smoking is one of the leading causes of cardiovascular disease. Quitting can reduce your risk by up to 50% within one year.",
            "actions": [
                "Set a quit date and create a cessation plan",
                "Consult your doctor about nicotine replacement therapy or medication",
                "Avoid triggers and environments that encourage smoking",
                "Join a smoking cessation support group",
                "Consider counseling or behavioral therapy",
            ],
        })
    return recs


def _alcohol_recommendations(alco: int):
    """Alcohol consumption based recommendations."""
    recs = []
    if alco == 1:
        recs.append({
            "category": "Alcohol",
        
            "severity": "moderate",
            "title": "Alcohol Consumption Advisory",
            "description": "Regular alcohol consumption can raise blood pressure and contribute to weight gain, increasing cardiovascular risk.",
            "actions": [
                "Limit alcohol to no more than 1 drink/day for women, 2 for men",
                "Avoid binge drinking episodes",
                "Consider alcohol-free days each week",
                "Opt for healthier alternatives like herbal teas or infused water",
            ],
        })
    return recs


def _activity_recommendations(active: int):
    """Physical activity based recommendations."""
    recs = []
    if active == 0:
        recs.append({
            "category": "Physical Activity",
       
            "severity": "moderate",
            "title": "Sedentary Lifestyle Warning",
            "description": "A sedentary lifestyle significantly increases the risk of heart disease. Regular physical activity is essential.",
            "actions": [
                "Start with 15-20 minutes of brisk walking daily, gradually increase",
                "Aim for at least 150 minutes of moderate aerobic activity per week",
                "Include muscle-strengthening activities 2+ days per week",
                "Take breaks from sitting every 30 minutes",
                "Consider activities you enjoy: swimming, cycling, dancing, yoga",
            ],
        })
    return recs


def _age_recommendations(age: float):
    """Age-specific recommendations."""
    recs = []
    if age >= 55:
        recs.append({
            "category": "Age-Related",
        
            "severity": "moderate",
            "title": "Age-Related Cardiovascular Monitoring",
            "description": "Cardiovascular risk increases with age. Regular comprehensive check-ups are essential.",
            "actions": [
                "Schedule cardiac check-ups every 6 months",
                "Get an ECG and 2D Echocardiogram annually",
                "Discuss aspirin therapy with your doctor",
                "Stay updated on vaccinations (flu, pneumonia)",
                "Maintain social connections and mental well-being",
            ],
        })
    return recs


def _risk_level_recommendations(risk_category: str, risk_probability: float):
    """Overall risk-level based general recommendations."""
    risk_pct = round(risk_probability * 100)
    recs = []

    if risk_category == "High Risk":
        recs.append({
            "category": "Urgent Action",
         
            "severity": "high",
            "title": f"High Cardiovascular Risk ({risk_pct}%)",
            "description": "Your overall cardiovascular risk is HIGH. Immediate medical consultation is strongly recommended.",
            "actions": [
                "Schedule a cardiologist appointment within the next 7 days",
                "Do NOT ignore symptoms like chest pain, breathlessness, or dizziness",
                "Get a comprehensive cardiac evaluation (ECG, stress test, echocardiogram)",
                "Strictly follow prescribed medications – do not skip doses",
                "Keep emergency contact numbers readily available",
            ],
        })
    elif risk_category == "Moderate Risk":
        recs.append({
            "category": "Preventive Care",
          
            "severity": "moderate",
            "title": f"Moderate Cardiovascular Risk ({risk_pct}%)",
            "description": "Your cardiovascular risk is moderate. Proactive lifestyle changes can significantly lower your risk.",
            "actions": [
                "Schedule a check-up with your physician within the month",
                "Adopt a heart-healthy diet (Mediterranean or DASH diet)",
                "Begin a regular exercise routine if not already active",
                "Manage stress through mindfulness, yoga, or hobbies",
                "Get 7-8 hours of quality sleep each night",
            ],
        })
    else:
        recs.append({
            "category": "Maintenance",
         
            "severity": "low",
            "title": f"Low Cardiovascular Risk ({risk_pct}%)",
            "description": "Your current cardiovascular risk is low. Keep up the good work and maintain your healthy habits.",
            "actions": [
                "Continue regular annual health check-ups",
                "Maintain your current exercise and diet routine",
                "Stay informed about heart health",
                "Keep monitoring blood pressure and cholesterol periodically",
            ],
        })
    return recs


# ───────────────────────────────────────────────────────────
# Public API
# ───────────────────────────────────────────────────────────

def generate_recommendations(
    patient_data: dict,
    risk_category: str,
    risk_probability: float,
    top_risk_factors: list,
) -> list[dict]:
    """
    Generate personalised health recommendations.

    Returns a list of recommendation objects, each containing:
      category, icon, severity, title, description, actions[]
    """
    recs: list[dict] = []

    # 1. Overall risk-level recommendation (always first)
    recs.extend(_risk_level_recommendations(risk_category, risk_probability))

    # 2. Patient-vital-specific recommendations
    ap_hi = patient_data.get("ap_hi", 0)
    ap_lo = patient_data.get("ap_lo", 0)
    recs.extend(_bp_recommendations(ap_hi, ap_lo))

    recs.extend(_cholesterol_recommendations(patient_data.get("cholesterol", 1)))
    recs.extend(_glucose_recommendations(patient_data.get("gluc", 1)))
    recs.extend(_bmi_recommendations(
        patient_data.get("weight", 0),
        patient_data.get("height", 1),
    ))
    recs.extend(_smoking_recommendations(patient_data.get("smoke", 0)))
    recs.extend(_alcohol_recommendations(patient_data.get("alco", 0)))
    recs.extend(_activity_recommendations(patient_data.get("active", 1)))
    recs.extend(_age_recommendations(patient_data.get("age", 0)))

    # 3. Add specialist referral recommendation if moderate or high risk
    if risk_category in ("High Risk", "Moderate Risk"):
        referral_rec = _referral_recommendation(risk_category, risk_probability, patient_data)
        if referral_rec:
            recs.extend(referral_rec)

    return recs


def _referral_recommendation(risk_cat: str, risk_prob: float, patient_data: dict):
    """Generate a referral recommendation card based on risk and contributing factors."""
    recs = []
    specialists = []
    tests = []

    if risk_cat == "High Risk":
        specialists.append("Cardiologist")
        tests.extend(["ECG", "2D Echocardiogram", "Stress Test", "Complete Lipid Profile"])
        timeline = "within 7 days"
    else:
        specialists.append("General Physician")
        tests.extend(["Complete Lipid Profile", "Fasting Blood Sugar"])
        timeline = "within 30 days"

    # Add endocrinologist if glucose is elevated
    gluc = patient_data.get("gluc", 1)
    if gluc >= 2:
        specialists.append("Endocrinologist")
        if "HbA1c Test" not in tests:
            tests.append("HbA1c Test")

    # Add nutritionist if BMI >= 30
    weight = patient_data.get("weight", 0)
    height = patient_data.get("height", 1)
    if height > 0:
        bmi = weight / ((height / 100) ** 2)
        if bmi >= 30:
            specialists.append("Nutritionist / Dietitian")

    specialist_str = ", ".join(specialists)
    tests_str = ", ".join(tests)

    recs.append({
        "category": "Specialist Referral",
        "severity": "high" if risk_cat == "High Risk" else "moderate",
        "title": f"Consult: {specialist_str}",
        "description": f"Based on your risk profile, schedule an appointment {timeline}. Recommended tests: {tests_str}.",
        "actions": [
            f"Book appointment with {s}" for s in specialists
        ] + [
            f"Get tested: {t}" for t in tests
        ],
    })
    return recs
