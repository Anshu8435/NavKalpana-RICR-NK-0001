import pandas as pd

def engineer_features(data: dict):
    df = pd.DataFrame([data])

    # BMI
    df["bmi"] = df["weight"] / ((df["height"] / 100) ** 2)

    # Age Group
    df["age_group"] = pd.cut(
        df["age"],
        bins=[0, 30, 40, 50, 60, 100],
        labels=[0, 1, 2, 3, 4]
    ).astype(int)

    # Pulse Pressure
    df["pulse_pressure"] = df["ap_hi"] - df["ap_lo"]

    # Clinical Interactions
    df["age_bp_interaction"] = df["age"] * df["ap_hi"]
    df["glucose_bmi"] = df["gluc"] * df["bmi"]

    return df