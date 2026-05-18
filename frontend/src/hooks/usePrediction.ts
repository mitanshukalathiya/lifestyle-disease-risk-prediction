"use client";
import { useState } from "react";
import { PatientInput, PredictionResponse } from "@/types";
import { predictRisk } from "@/lib/api";

export function usePrediction() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function predict(data: PatientInput) {
    setLoading(true);
    setError(null);
    try {
      setResult(await predictRisk(data));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  function reset() { setResult(null); setError(null); }

  return { result, loading, error, predict, reset };
}
