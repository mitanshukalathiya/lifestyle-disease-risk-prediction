import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import numpy as np

from app.main import app

SAMPLE_PATIENT = {
    "age_years": 45,
    "gender": 2,
    "height": 175.0,
    "weight": 80.0,
    "ap_hi": 130,
    "ap_lo": 85,
    "cholesterol": 2,
    "gluc": 1,
    "smoke": 0,
    "alco": 0,
    "active": 1,
}


@pytest.fixture
def client():
    mock_model = MagicMock()
    mock_model.predict_proba.return_value = np.array([[0.38, 0.62]])
    with patch("app.core.lifespan.ml_model", {"predictor": mock_model}):
        with TestClient(app) as c:
            yield c


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_predict_success(client):
    r = client.post("/predict", json=SAMPLE_PATIENT)
    assert r.status_code == 200
    body = r.json()
    assert "risk_score" in body
    assert "risk_level" in body
    assert "bmi" in body
    assert isinstance(body["recommendations"], list)


def test_predict_invalid_bp(client):
    bad = {**SAMPLE_PATIENT, "ap_hi": 80, "ap_lo": 90}
    r = client.post("/predict", json=bad)
    assert r.status_code == 422


def test_predict_bmi_not_in_request():
    assert "bmi" not in SAMPLE_PATIENT