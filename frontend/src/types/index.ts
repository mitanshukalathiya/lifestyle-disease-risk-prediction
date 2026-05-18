export interface PatientInput {
  age_years: number;
  gender: number;
  height: number;
  weight: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number;
  gluc: number;
  smoke: number;
  alco: number;
  active: number;
}

export interface PredictionResponse {
  risk_probability: number;
  risk_score: number;
  risk_level: "Low Risk" | "Medium Risk" | "High Risk";
  bmi: number;
  recommendations: string[];
}

export type RiskLevel = "Low Risk" | "Medium Risk" | "High Risk";
