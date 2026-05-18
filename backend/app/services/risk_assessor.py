def classify_risk(probability: float) -> str:
    if probability < 0.30:
        return "Low Risk"
    elif probability < 0.60:
        return "Medium Risk"
    return "High Risk"


def calculate_risk_score(probability: float) -> int:
    return round(probability * 100)


def generate_recommendations(patient_data: dict, bmi: float) -> list[str]:
    recs = []

    if bmi > 25:
        recs.append("Maintain a healthy weight through balanced diet and regular exercise.")
    if patient_data["ap_hi"] > 130:
        recs.append("Monitor blood pressure regularly and reduce salt intake.")
    if patient_data["cholesterol"] > 1:
        recs.append("Reduce saturated fat and increase fiber intake.")
    if patient_data["gluc"] > 1:
        recs.append("Monitor blood sugar and reduce sugar consumption.")
    if patient_data["active"] == 0:
        recs.append("Increase physical activity — at least 30 minutes daily.")
    if patient_data["smoke"] == 1:
        recs.append("Quit smoking to significantly reduce cardiovascular risk.")
    if patient_data["alco"] == 1:
        recs.append("Limit alcohol consumption.")

    if not recs:
        recs.append("Maintain your healthy lifestyle and schedule regular health checkups.")

    return recs