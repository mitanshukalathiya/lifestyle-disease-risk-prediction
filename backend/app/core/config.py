from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    APP_NAME: str = "CVD Risk Prediction API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    MODEL_PATH: Path = Path(__file__).resolve().parents[3] / "ml" / "artifacts" / "cardiovascular_model_v1.pkl"

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()