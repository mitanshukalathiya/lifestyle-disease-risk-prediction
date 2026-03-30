from predict import load_model, predict_probability


def classify_risk(probability: float) -> str:
    if probability < 0.30:
        return "Low Risk"

    elif probability < 0.60:
        return "Medium Risk"

    else:
        return "High Risk"
    

def calculate_risk_score(probability: float):
    return round(probability * 100)


def generate_recommendations(patient_data: dict):
    recommendations = []

    if patient_data["bmi"] > 25:
        recommendations.append(
            "Maintain healthy weight through balanced diet and regular exercise."
        )

    if patient_data["ap_hi"] > 130:
        recommendations.append(
            "Monitor blood pressure regularly and reduce salt intake."
        )

    if patient_data["cholesterol"] > 1:
        recommendations.append(
            "Reduce saturated fat and increase fiber intake."
        )

    if patient_data["gluc"] > 1:
        recommendations.append(
            "Monitor blood sugar and reduce sugar consumption."
        )

    if patient_data["active"] == 0:
        recommendations.append(
            "Increase physical activity (at least 30 minutes daily)."
        )

    if patient_data["smoke"] == 1:
        recommendations.append(
            "Quit smoking to reduce cardiovascular risk."
        )

    if patient_data["alco"] == 1:
        recommendations.append(
            "Limit alcohol consumption."
        )

    if len(recommendations) == 0:
        recommendations.append(
            "Maintain healthy lifestyle and schedule regular health checkups."
        )

    return recommendations


def predict_health_risk(patient_data: dict):
    model = load_model()

    probability = predict_probability(model, patient_data)

    risk_score = calculate_risk_score(probability)

    risk_level = classify_risk(probability)

    recommendations = generate_recommendations(patient_data)

    return {
        "risk_probability": probability,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendations": recommendations
    }


# -----------------------------
# Demo Patients for Testing
# -----------------------------

healthy_patient = {
    "gender": 1,
    "height": 168,
    "weight": 60,
    "ap_hi": 110,
    "ap_lo": 70,
    "cholesterol": 1,
    "gluc": 1,
    "smoke": 0,
    "alco": 0,
    "active": 1,
    "age_years": 28,
    "bmi": 21.3
}

moderate_risk_patient = {
    "gender": 2,
    "height": 160,
    "weight": 65,
    "ap_hi": 130,
    "ap_lo": 85,
    "cholesterol": 2,
    "gluc": 1,
    "smoke": 1,
    "alco": 1,
    "active": 0,
    "age_years": 45,
    "bmi": 25.4
}

high_risk_patient = {
    "gender": 1,
    "height": 170,
    "weight": 96,
    "ap_hi": 155,
    "ap_lo": 95,
    "cholesterol": 3,
    "gluc": 2,
    "smoke": 1,
    "alco": 1,
    "active": 0,
    "age_years": 60,
    "bmi": 33.2
}


def run_demo():
    patients = {
        "Healthy Patient": healthy_patient,
        "Moderate Risk Patient": moderate_risk_patient,
        "High Risk Patient": high_risk_patient
    }

    for name, patient in patients.items():

        print("\n==============================")
        print(name)
        print("==============================")

        result = predict_health_risk(patient)

        print("Risk Score:", result["risk_score"], "/100")
        print("Risk Level:", result["risk_level"])

        print("\nPreventive Recommendations:")
        for rec in result["recommendations"]:
            print("-", rec)

        print("\n")


# -----------------------------------------------------------
# Optional: Function to allow user input for prediction
# -----------------------------------------------------------
"""
def user_input_prediction():
    print("\nEnter Patient Details")

    gender = int(input("Gender (1=Female, 2=Male): "))
    height = float(input("Height (cm): "))
    weight = float(input("Weight (kg): "))
    ap_hi = int(input("Systolic BP (ap_hi): "))
    ap_lo = int(input("Diastolic BP (ap_lo): "))
    cholesterol = int(input("Cholesterol (1=Normal, 2=Above Normal, 3=Well Above Normal): "))
    gluc = int(input("Glucose (1=Normal, 2=Above Normal, 3=Well Above Normal): "))
    smoke = int(input("Smoke (0=No, 1=Yes): "))
    alco = int(input("Alcohol (0=No, 1=Yes): "))
    active = int(input("Physically Active (0=No, 1=Yes): "))
    age_years = int(input("Age (years): "))

    # Calculate BMI automatically
    bmi = weight / ((height / 100) ** 2)

    patient_data = {
        "gender": gender,
        "height": height,
        "weight": weight,
        "ap_hi": ap_hi,
        "ap_lo": ap_lo,
        "cholesterol": cholesterol,
        "gluc": gluc,
        "smoke": smoke,
        "alco": alco,
        "active": active,
        "age_years": age_years,
        "bmi": bmi
    }

    result = predict_health_risk(patient_data)

    print("\n==============================")
    print("User Prediction Result")
    print("==============================")

    print("Risk Score:", result["risk_score"], "/100")
    print("Risk Level:", result["risk_level"])

    print("\nPreventive Recommendations:")
    for rec in result["recommendations"]:
        print("-", rec)
"""

if __name__ == "__main__":

    run_demo()
    # user_input_prediction()   # Uncomment to enable user input prediction

