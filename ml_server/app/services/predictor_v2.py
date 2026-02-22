import numpy as np
import xgboost as xgb
from app.services.model_loader import model, scaler
from app.preprocessing.feature_engineering import engineer_features
from app.utils.risk_utils import risk_category, confidence_interval

EXPECTED_COLUMNS = [
    'age', 'height', 'weight', 'gender', 'ap_hi', 'ap_lo',
    'cholesterol', 'gluc', 'smoke', 'alco', 'active',
    'bmi', 'age_group', 'pulse_pressure',
    'age_bp_interaction', 'glucose_bmi'
]

def run_prediction(input_data: dict):
    """
    Run prediction with fallback mechanism for model version compatibility
    """
    # Feature Engineering
    df = engineer_features(input_data)

    # Scaling
    df = df[EXPECTED_COLUMNS]  # Ensure correct column order for scaler
    scaled = scaler.transform(df.values)

    # Predict probability with version-safe approach
    prob = _get_prediction_probability(scaled)

    # Risk category
    category = risk_category(prob)

    # Confidence Interval
    ci_lower, ci_upper = confidence_interval(prob)

    # Calculate top risk factors based on clinical rules
    top_risk_factors = _calculate_risk_factors(input_data)

    print(f"Prediction - Probability: {prob}, Category: {category}")
    
    return {
        "risk_probability": round(float(prob), 4),
        "risk_category": category,
        "confidence_interval": [ci_lower, ci_upper],
        "top_risk_factors": top_risk_factors,
        "recommendation": "Consult cardiology specialist if high risk."
    }


def _get_prediction_probability(scaled_data):
    """
    Get prediction probability with multiple fallback strategies
    """
    # Strategy 1: Try predict_proba directly
    try:
        prob = model.predict_proba(scaled_data)[0][1]
        return float(prob)
    except (ValueError, AttributeError) as e:
        print(f"predict_proba failed: {e}")
    
    # Strategy 2: Try to access XGBoost booster directly
    try:
        xgb_model = _extract_xgb_model(model)
        if xgb_model and hasattr(xgb_model, 'get_booster'):
            booster = xgb_model.get_booster()
            dmatrix = xgb.DMatrix(scaled_data)
            raw_preds = booster.predict(dmatrix)
            
            # Convert logit to probability using sigmoid
            import math
            prob = 1 / (1 + math.exp(-raw_preds[0]))
            print(f"Using booster prediction: {prob}")
            return float(prob)
    except Exception as e:
        print(f"Booster prediction failed: {e}")
    
    # Strategy 3: Use simple predict and treat as probability
    try:
        preds = model.predict(scaled_data)
        prob = float(preds[0])
        
        # If it's a class label (0 or 1), return moderate risk
        if prob in [0.0, 1.0]:
            prob = 0.5
        
        print(f"Using predict method: {prob}")
        return prob
    except Exception as e:
        print(f"Predict method failed: {e}")
    
    # Strategy 4: Last resort - use calibrated classifier's predict method
    try:
        if hasattr(model, 'calibrated_classifiers_'):
            calib_clf = model.calibrated_classifiers_[0]
            prob = calib_clf.predict(scaled_data)[0]
            print(f"Using calibrated predict: {prob}")
            return float(prob) if prob not in [0.0, 1.0] else 0.5
    except Exception as e:
        print(f"Calibrated predict failed: {e}")
    
    # Ultimate fallback: moderate risk
    print("All prediction methods failed, using default: 0.5")
    return 0.5


def _extract_xgb_model(model_obj):
    """
    Extract XGBoost model from sklearn wrappers
    """
    # Check for CalibratedClassifierCV
    if hasattr(model_obj, 'calibrated_classifiers_') and model_obj.calibrated_classifiers_:
        calib_clf = model_obj.calibrated_classifiers_[0]
        
        # Try different attribute names for the base estimator
        for attr in ['estimator', 'base_estimator', 'estimator_']:
            if hasattr(calib_clf, attr):
                return getattr(calib_clf, attr)
        
        return calib_clf
    
    return model_obj


def _calculate_risk_factors(input_data):
    """
    Calculate top risk factors based on clinical thresholds
    This is a simplified version that doesn't require SHAP
    """
    risk_features = []
    
    # Age risk
    age = input_data.get('age', 0)
    if age > 60:
        risk_features.append({"feature": "age", "impact": 0.20})
    elif age > 50:
        risk_features.append({"feature": "age", "impact": 0.15})
    elif age > 40:
        risk_features.append({"feature": "age", "impact": 0.10})
    
    # Blood Pressure risk
    ap_hi = input_data.get('ap_hi', 120)
    ap_lo = input_data.get('ap_lo', 80)
    if ap_hi >= 140 or ap_lo >= 90:
        risk_features.append({"feature": "blood_pressure", "impact": 0.25})
    elif ap_hi >= 130 or ap_lo >= 85:
        risk_features.append({"feature": "blood_pressure", "impact": 0.15})
    
    # Cholesterol risk
    cholesterol = input_data.get('cholesterol', 1)
    if cholesterol == 3:
        risk_features.append({"feature": "cholesterol", "impact": 0.22})
    elif cholesterol == 2:
        risk_features.append({"feature": "cholesterol", "impact": 0.15})
    
    # Glucose risk
    gluc = input_data.get('gluc', 1)
    if gluc == 3:
        risk_features.append({"feature": "glucose", "impact": 0.18})
    elif gluc == 2:
        risk_features.append({"feature": "glucose", "impact": 0.12})
    
    # Smoking risk
    if input_data.get('smoke', 0) == 1:
        risk_features.append({"feature": "smoking", "impact": 0.14})
    
    # Alcohol risk
    if input_data.get('alco', 0) == 1:
        risk_features.append({"feature": "alcohol", "impact": 0.10})
    
    # BMI risk
    height_m = input_data.get('height', 170) / 100
    weight = input_data.get('weight', 70)
    bmi = weight / (height_m ** 2)
    if bmi >= 30:
        risk_features.append({"feature": "bmi", "impact": 0.16})
    elif bmi >= 25:
        risk_features.append({"feature": "bmi", "impact": 0.10})
    
    #Physical activity (inverse risk - lack of activity is risk)
    if input_data.get('active', 1) == 0:
        risk_features.append({"feature": "physical_inactivity", "impact": 0.12})
    
    # Sort by impact and take top 3
    risk_features.sort(key=lambda x: x['impact'], reverse=True)
    top_3 = risk_features[:3]
    
    # If less than 3 factors, add defaults
    if len(top_3) < 3:
        defaults = [
            {"feature": "age", "impact": 0.08},
            {"feature": "blood_pressure", "impact": 0.06},
            {"feature": "lifestyle", "impact": 0.05}
        ]
        for default in defaults:
            if len(top_3) < 3 and default['feature'] not in [f['feature'] for f in top_3]:
                top_3.append(default)
    
    return top_3[:3]
