from fastapi import APIRouter
from app.core.lifespan import ml_model

router = APIRouter()


@router.get("/health")
def health():
    return {
        "status": "ok",
        "model": "loaded" if "predictor" in ml_model else "not loaded",
    }