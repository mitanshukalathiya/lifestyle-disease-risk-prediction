"use client";
import { useState } from "react";
import { usePrediction } from "@/hooks/usePrediction";
import { PatientInput } from "@/types";
import Header from "@/components/dashboard/Header";
import PatientForm from "@/components/dashboard/PatientForm";
import RiskDashboard from "@/components/dashboard/RiskDashboard";

export default function Home() {
  const { result, loading, error, predict, reset } = usePrediction();
  const [submitted, setSubmitted] = useState(false);
  const [patientData, setPatientData] = useState<Record<string, number>>({});

  async function handleSubmit(data: PatientInput) {
    setPatientData(data as unknown as Record<string, number>);
    setSubmitted(true);
    await predict(data);
  }

  function handleReset() { reset(); setSubmitted(false); }

  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg)" }}>
      <Header onReset={submitted ? handleReset : undefined} />
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!submitted || loading ? (
          <PatientForm onSubmit={handleSubmit} loading={loading} />
        ) : error ? (
          <ErrorCard error={error} onReset={handleReset} />
        ) : result ? (
          <RiskDashboard result={result} onReset={handleReset} patientData={patientData} />
        ) : null}
      </main>
    </div>
  );
}

function ErrorCard({ error, onReset }: { error: string; onReset: () => void }) {
  return (
    <div className="anim-fade-up max-w-md mx-auto mt-20 glow-card p-8 text-center"
      style={{ borderColor: "rgba(239,68,68,0.3)" }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 6v5M10 14h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="10" cy="10" r="8.5" stroke="#ef4444" strokeWidth="1.5"/>
        </svg>
      </div>
      <p className="font-semibold mb-1" style={{ color: "var(--text-1)" }}>Prediction failed</p>
      <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>{error}</p>
      <button onClick={onReset} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
        style={{ background: "var(--red)" }}>Try again</button>
    </div>
  );
}
