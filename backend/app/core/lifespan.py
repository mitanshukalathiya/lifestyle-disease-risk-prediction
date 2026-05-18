from contextlib import asynccontextmanager
from fastapi import FastAPI
import joblib
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

ml_model = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_path = settings.MODEL_PATH
    if not model_path.exists():
        logger.critical(f"Model file not found at: {model_path}")
        raise FileNotFoundError(f"Model not found: {model_path}")

    logger.info(f"Loading model from {model_path}...")
    ml_model["predictor"] = joblib.load(model_path)
    logger.info("Model loaded successfully.")

    yield

    ml_model.clear()
    logger.info("Model unloaded.")


def get_model():
    if "predictor" not in ml_model:
        raise RuntimeError("Model is not loaded.")
    return ml_model["predictor"]