import shap
import numpy as np
from app.services.model_loader import model
from app.preprocessing.feature_engineering import engineer_features
from app.utils.risk_utils import risk_category, confidence_interval
from app.utils.recommendation_engine import generate_recommendations

# Column order must match training: after dropping 'id' and 'cardio' from original CSV
# Original CSV order: id, age, gender, height, weight, ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active, cardio
EXPECTED_COLUMNS = [
    'age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo',
    'cholesterol', 'gluc', 'smoke', 'alco', 'active',
    'bmi', 'pulse_pressure', 'age_bp_interaction', 'glucose_bmi'
]

class _ShapWrapper:
    def __init__(self, explainer):
        self.explainer = explainer

    def shap_values(self, X):
        # Prefer explainer.shap_values if available (TreeExplainer)
        if hasattr(self.explainer, "shap_values"):
            return self.explainer.shap_values(X)
        # Otherwise call the explainer and return .values
        res = self.explainer(X)
        # shap.Explainer returns an Explanation object; .values is the array
        return res.values


def _make_explainer(model_obj, background=None):
    # 1) If it's a direct tree/ensemble with estimators_, use first estimator
    try:
        if hasattr(model_obj, "estimators_"):
            return _ShapWrapper(shap.TreeExplainer(model_obj.estimators_[0]))

        # 2) CalibratedClassifierCV stores fitted calibrated classifiers
        if hasattr(model_obj, "calibrated_classifiers_") and model_obj.calibrated_classifiers_:
            clf = model_obj.calibrated_classifiers_[0]
            for attr in ("estimator", "base_estimator", "estimator_"):
                if hasattr(clf, attr):
                    inner = getattr(clf, attr)
                    if hasattr(inner, "estimators_") or hasattr(inner, "tree_"):
                        return _ShapWrapper(shap.TreeExplainer(inner))
            # fallback to using the calibrated classifier itself if it looks tree-like
            if hasattr(clf, "estimators_") or hasattr(clf, "tree_"):
                return _ShapWrapper(shap.TreeExplainer(clf))

        # 3) If model_obj has an `estimator` attribute (wrapper), try that
        if hasattr(model_obj, "estimator"):
            inner = getattr(model_obj, "estimator")
            if hasattr(inner, "estimators_") or hasattr(inner, "tree_"):
                return _ShapWrapper(shap.TreeExplainer(inner))

    except Exception:
        # Fall through to generic explainer
        pass

    # 4) Generic fallback: if we have background data, use KernelExplainer with predict_proba
    # (safer when SHAP can't analyze the object directly). Otherwise try shap.Explainer.
    try:
        if background is not None and hasattr(model_obj, "predict_proba"):
            return _ShapWrapper(shap.KernelExplainer(model_obj.predict_proba, background))
        if hasattr(model_obj, "predict_proba"):
            return _ShapWrapper(shap.Explainer(model_obj.predict_proba))
        return _ShapWrapper(shap.Explainer(model_obj))
    except Exception:
        # As a final fallback, raise so caller can handle absence of explainer.
        raise


# Create explainer lazily inside run_prediction (needs example/background data).
explainer = None

def run_prediction(input_data: dict):

    # Feature Engineering
    df = engineer_features(input_data)

    # Ensure correct column order
    df = df[EXPECTED_COLUMNS]

    # Predict probability (model expects unscaled data - XGBoost was trained without scaling)
    proba_result = model.predict_proba(df.values)
    prob = proba_result[0][1]

    # Risk category
    category = risk_category(prob)

    # Confidence Interval
    ci_lower, ci_upper = confidence_interval(prob)

    # SHAP Explainability
    global explainer
    if explainer is None:
        try:
            base_model = model.estimator  # unwrap calibrated model
            explainer = shap.TreeExplainer(base_model)
        except Exception:
            # If explainer creation fails, set to None and skip SHAP contributions
            explainer = None

    shap_contrib = None
    if explainer is not None:
        # Use raw features for SHAP - same as what was passed to model
        shap_values = explainer.shap_values(df.values)
        # If shap_values returns a list (per-class), pick the first class (as before)
        if isinstance(shap_values, (list, tuple)):
            shap_contrib = shap_values[0]
        else:
            shap_contrib = shap_values

    feature_names = df.columns
    top_risk_factors = []
    if shap_contrib is not None:
        arr = np.asarray(shap_contrib)
        # Handle shapes:
        # - (n_classes, n_samples, n_features) -> pick first class
        # - (n_samples, n_features) -> if single sample use that row, else average across samples
        # - (n_features,) -> already per-feature
        if arr.ndim == 3:
            arr = arr[0]
        if arr.ndim == 2:
            if arr.shape[0] == 1:
                arr = arr[0]
            else:
                arr = np.mean(arr, axis=0)

        # Ensure arr is 1-D of length == number of features
        arr = arr.ravel()
        shap_dict = dict(zip(feature_names, arr))
        top_features = sorted(shap_dict.items(), key=lambda x: abs(float(x[1])), reverse=True)[:3]
        top_risk_factors = [{"feature": f, "impact": round(float(v), 4)} for f, v in top_features]
    
    # Build full SHAP contributions dict for all features
    shap_contributions = {}
    if shap_contrib is not None:
        arr_full = np.asarray(shap_contrib)
        if arr_full.ndim == 3:
            arr_full = arr_full[0]
        if arr_full.ndim == 2:
            if arr_full.shape[0] == 1:
                arr_full = arr_full[0]
            else:
                arr_full = np.mean(arr_full, axis=0)
        arr_full = arr_full.ravel()
        shap_contributions = {str(f): round(float(v), 4) for f, v in zip(feature_names, arr_full)}

    # Generate counterfactual explanations
    counterfactuals = _generate_counterfactuals(input_data, df, prob, category)

    # Generate specialist referral suggestion
    referral = _generate_referral(category, float(prob), top_risk_factors, input_data)

    # Generate personalised recommendations
    recommendations = generate_recommendations(
        patient_data=input_data,
        risk_category=category,
        risk_probability=float(prob),
        top_risk_factors=top_risk_factors,
    )

    result = {
        "risk_probability": round(float(prob), 4),
        "risk_category": category,
        "confidence_interval": [ci_lower, ci_upper],
        "top_risk_factors": top_risk_factors,
        "shap_contributions": shap_contributions,
        "counterfactuals": counterfactuals,
        "referral": referral,
        "recommendation": "Consult cardiology specialist if high risk.",
        "recommendations": recommendations,
    }
    return result


def _generate_counterfactuals(input_data: dict, original_df, original_prob: float, original_category: str):
    """
    Generate actionable what-if counterfactual explanations.
    For each modifiable feature, simulate a healthier value and re-predict.
    """
    counterfactuals = []

    # Define modifiable features with their healthy target values and labels
    modifiable = [
        {"feature": "ap_hi", "target": 120, "label": "Systolic BP", "unit": "mmHg"},
        {"feature": "ap_lo", "target": 80, "label": "Diastolic BP", "unit": "mmHg"},
        {"feature": "cholesterol", "target": 1, "label": "Cholesterol", "unit": "(Normal)"},
        {"feature": "gluc", "target": 1, "label": "Glucose", "unit": "(Normal)"},
        {"feature": "smoke", "target": 0, "label": "Smoking", "unit": ""},
        {"feature": "alco", "target": 0, "label": "Alcohol", "unit": ""},
        {"feature": "active", "target": 1, "label": "Physical Activity", "unit": ""},
    ]

    for mod in modifiable:
        feat = mod["feature"]
        current_val = input_data.get(feat)
        target_val = mod["target"]

        # Skip if already at healthy target or feature not present
        if current_val is None or current_val == target_val:
            continue
        # For active, skip if already active
        if feat == "active" and current_val == 1:
            continue
        # For smoke/alco, skip if already 0
        if feat in ("smoke", "alco") and current_val == 0:
            continue

        # Create modified input
        modified_input = dict(input_data)
        modified_input[feat] = target_val

        try:
            modified_df = engineer_features(modified_input)
            modified_df = modified_df[EXPECTED_COLUMNS]
            modified_proba = model.predict_proba(modified_df.values)[0][1]
            new_category = risk_category(modified_proba)

            reduction = original_prob - modified_proba
            if reduction > 0.005:  # Only show meaningful changes
                # Build description
                if feat in ("smoke", "alco"):
                    change_desc = f"If you quit {'smoking' if feat == 'smoke' else 'alcohol'}"
                elif feat == "active":
                    change_desc = "If you become physically active"
                elif feat in ("cholesterol", "gluc"):
                    change_desc = f"If your {mod['label']} returns to Normal"
                else:
                    change_desc = f"If your {mod['label']} was {target_val} {mod['unit']}"

                counterfactuals.append({
                    "feature": feat,
                    "label": mod["label"],
                    "current_value": current_val,
                    "target_value": target_val,
                    "change_description": change_desc,
                    "current_risk": round(float(original_prob), 4),
                    "new_risk": round(float(modified_proba), 4),
                    "risk_reduction": round(float(reduction), 4),
                    "new_category": new_category,
                })
        except Exception:
            continue

    # Sort by largest risk reduction
    counterfactuals.sort(key=lambda x: x["risk_reduction"], reverse=True)
    return counterfactuals


def _generate_referral(category: str, prob: float, top_risk_factors: list, input_data: dict):
    """
    Generate specialist referral suggestions based on risk severity and contributing factors.
    """
    referral = {
        "urgency": "routine",
        "specialists": [],
        "timeline": "",
        "tests_recommended": [],
    }

    if category == "High Risk":
        referral["urgency"] = "urgent"
        referral["timeline"] = "Within 7 days"
        referral["specialists"].append({
            "type": "Cardiologist",
            "reason": f"High cardiovascular risk ({round(prob * 100)}%). Comprehensive cardiac evaluation needed.",
        })
        referral["tests_recommended"].extend([
            "ECG (Electrocardiogram)",
            "2D Echocardiogram",
            "Stress Test (Treadmill)",
            "Complete Lipid Profile",
        ])
    elif category == "Moderate Risk":
        referral["urgency"] = "soon"
        referral["timeline"] = "Within 30 days"
        referral["specialists"].append({
            "type": "General Physician",
            "reason": f"Moderate cardiovascular risk ({round(prob * 100)}%). Preventive evaluation recommended.",
        })
        referral["tests_recommended"].extend([
            "Complete Lipid Profile",
            "Fasting Blood Sugar",
            "Blood Pressure Monitoring",
        ])
    else:
        referral["urgency"] = "routine"
        referral["timeline"] = "Annual check-up"
        referral["tests_recommended"].append("Routine annual health screening")

    # Add specific specialists based on risk factors
    factor_names = [f["feature"] for f in top_risk_factors] if top_risk_factors else []

    ap_hi = input_data.get("ap_hi", 0)
    if ap_hi >= 140 or "ap_hi" in factor_names or "pulse_pressure" in factor_names:
        if not any(s["type"] == "Cardiologist" for s in referral["specialists"]):
            referral["specialists"].append({
                "type": "Cardiologist",
                "reason": "Elevated blood pressure contributing to risk.",
            })

    gluc = input_data.get("gluc", 1)
    if gluc >= 2 or "gluc" in factor_names or "glucose_bmi" in factor_names:
        referral["specialists"].append({
            "type": "Endocrinologist",
            "reason": "Elevated glucose levels may indicate diabetes or pre-diabetes.",
        })
        if "HbA1c Test" not in referral["tests_recommended"]:
            referral["tests_recommended"].append("HbA1c Test")

    weight = input_data.get("weight", 0)
    height = input_data.get("height", 1)
    if height > 0:
        bmi = weight / ((height / 100) ** 2)
        if bmi >= 30 or "bmi" in factor_names:
            referral["specialists"].append({
                "type": "Nutritionist / Dietitian",
                "reason": f"BMI of {bmi:.1f} indicates obesity. Dietary intervention recommended.",
            })

    return referral