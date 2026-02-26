import os
import joblib

MODEL_PATH = os.getenv("MODEL_PATH", "saved_models/cardioshield_final_model.pkl")
SCALER_PATH = os.getenv("SCALER_PATH", "saved_models/scaler.pkl")

model = joblib.load(MODEL_PATH)

# Note: scaler is loaded for potential future use but is NOT applied during prediction.
# The deployed XGBoost model was trained on unscaled features, so applying the scaler
# would actually degrade performance. Kept here for backward compatibility and
# if a future model version requires scaled inputs.
scaler = joblib.load(SCALER_PATH)

