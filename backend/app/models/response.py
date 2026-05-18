from pydantic import BaseModel


class PredictionResponse(BaseModel):
    risk_probability: float
    risk_score: int
    risk_level: str
    bmi: float
    recommendations: list[str]

    model_config = {
        "json_schema_extra": {
            "example": {
                "risk_probability": 0.62,
                "risk_score": 62,
                "risk_level": "High Risk",
                "bmi": 26.1,
                "recommendations": [
                    "Monitor blood pressure regularly and reduce salt intake.",
                    "Reduce saturated fat and increase fiber intake.",
                ]
            }
        }
    }