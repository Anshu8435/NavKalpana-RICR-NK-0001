import shap
import numpy as np
from app.services.model_loader import model
from app.preprocessing.feature_engineering import engineer_features
from app.utils.risk_utils import risk_category, confidence_interval

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
    
    result = {
        "risk_probability": round(float(prob), 4),
        "risk_category": category,
        "confidence_interval": [ci_lower, ci_upper],
        "top_risk_factors": top_risk_factors,
        "recommendation": "Consult cardiology specialist if high risk."
    }
    return result