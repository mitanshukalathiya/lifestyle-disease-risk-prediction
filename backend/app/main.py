# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from src.risk_assessment import predict_health_risk

# app = FastAPI(
#     title="AI Cardiovascular Disease Risk Prediction API",
#     description="Predict cardiovascular disease risk using machine learning",
#     version="1.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # allow all origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class PatientData(BaseModel):
#     age_years: int
#     gender: int
#     height: float
#     weight: float
#     ap_hi: int
#     ap_lo: int
#     cholesterol: int
#     gluc: int
#     smoke: int
#     alco: int
#     active: int
#     bmi: float


# @app.get("/")
# def home():
#     return {"message": "AI Cardiovascular Disease Risk Prediction API is running"}


# @app.post("/predict")
# def predict(data: PatientData):

#     patient_data = data.model_dump()

#     result = predict_health_risk(patient_data)

#     return result


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.lifespan import lifespan
from app.api import predict, health


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, tags=["health"])
    app.include_router(predict.router, tags=["prediction"])

    return app


app = create_app()