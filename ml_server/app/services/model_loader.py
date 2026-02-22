import joblib

MODEL_PATH = "saved_models/cardioshield_final_model.pkl"
SCALER_PATH = "saved_models/scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

