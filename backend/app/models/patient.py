from pydantic import BaseModel, Field, model_validator


class PatientInput(BaseModel):
    age_years: int = Field(..., ge=1, le=120, description="Age in years")
    gender: int = Field(..., ge=1, le=2, description="1=Female, 2=Male")
    height: float = Field(..., ge=100.0, le=250.0, description="Height in cm")
    weight: float = Field(..., ge=20.0, le=300.0, description="Weight in kg")
    ap_hi: int = Field(..., ge=60, le=300, description="Systolic blood pressure")
    ap_lo: int = Field(..., ge=40, le=200, description="Diastolic blood pressure")
    cholesterol: int = Field(..., ge=1, le=3, description="1=Normal, 2=Above normal, 3=Well above normal")
    gluc: int = Field(..., ge=1, le=3, description="1=Normal, 2=Above normal, 3=Well above normal")
    smoke: int = Field(..., ge=0, le=1, description="0=No, 1=Yes")
    alco: int = Field(..., ge=0, le=1, description="0=No, 1=Yes")
    active: int = Field(..., ge=0, le=1, description="0=No, 1=Yes")

    @model_validator(mode="after")
    def systolic_must_exceed_diastolic(self) -> "PatientInput":
        if self.ap_hi <= self.ap_lo:
            raise ValueError("Systolic pressure (ap_hi) must be greater than diastolic (ap_lo).")
        return self

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }