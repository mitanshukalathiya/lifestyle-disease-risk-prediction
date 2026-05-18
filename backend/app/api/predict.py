from fastapi import APIRouter, HTTPException
from app.core.lifespan import get_model
from app.models.patient import PatientInput
from app.models.response import PredictionResponse
from app.services.predictor import run_prediction
from app.services.risk_assessor import classify_risk, calculate_risk_score, generate_recommendations

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict(data: PatientInput):
    try:
        model = get_model()
        patient_dict = data.model_dump()

        probability, _, bmi = run_prediction(model, patient_dict)

        return PredictionResponse(
            risk_probability=round(float(probability), 4),
            risk_score=calculate_risk_score(probability),
            risk_level=classify_risk(probability),
            bmi=bmi,
            recommendations=generate_recommendations(patient_dict, bmi),
        )

    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")