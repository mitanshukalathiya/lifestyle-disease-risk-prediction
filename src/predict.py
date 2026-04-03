import pandas as pd
import joblib
from pathlib import Path

# Get project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "cardiovascular_model.pkl"


def load_model():
    return joblib.load(MODEL_PATH)


def predict_probability(model, patient_data: dict):
    df = pd.DataFrame([patient_data])
    probability = model.predict_proba(df)[0][1]
    threshold = 0.35
    prediction = int(probability > threshold)
    return probability, prediction

