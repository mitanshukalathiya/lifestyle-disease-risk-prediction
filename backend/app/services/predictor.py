import pandas as pd
from app.utils.bmi import compute_bmi

FEATURE_ORDER = [
    "gender", "height", "weight",
    "ap_hi", "ap_lo",
    "cholesterol", "gluc",
    "smoke", "alco", "active",
    "age_years", "bmi",
]

THRESHOLD = 0.35


def run_prediction(model, patient_data: dict) -> tuple[float, int, float]:
    bmi = compute_bmi(patient_data["weight"], patient_data["height"])
    features = {**patient_data, "bmi": bmi}

    df = pd.DataFrame([features])[FEATURE_ORDER]
    probability: float = model.predict_proba(df)[0][1]
    prediction: int = int(probability > THRESHOLD)

    return probability, prediction, bmi