"use client";
import { useEffect, useState } from "react";
import { PredictionResponse, RiskLevel } from "@/types";
import RiskGauge from "@/components/ui/RiskGauge";
import RecommendationCards from "@/components/ui/RecommendationCards";
import HealthCharts from "@/components/charts/HealthCharts";

interface Props { result: PredictionResponse; onReset: () => void; patientData: Record<string, number>; }

const RISK_META: Record<RiskLevel, { color: string; bg: string; border: string; icon: string; desc: string }> = {
  "Low Risk":    { color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)", icon: "✓",  desc: "Your cardiovascular profile is healthy. Maintain your current habits." },
  "Medium Risk": { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)", icon: "!",  desc: "Moderate risk detected. Targeted lifestyle adjustments are recommended." },
  "High Risk":   { color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",  icon: "!!", desc: "Elevated risk detected. Please consult a healthcare professional promptly." },
};

function bmiClass(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
  if (bmi < 25)   return { label: "Normal",       color: "#10b981" };
  if (bmi < 30)   return { label: "Overweight",   color: "#f59e0b" };
  return                  { label: "Obese",        color: "#ef4444" };
}

function StatCard({ label, value, sub, color, delay, badge }: { label: string; value: string; sub?: string; color?: string; delay: string; badge?: { text: string; color: string } }) {
  return (
    <div className={`glow-card p-4 anim-count ${delay}`}>
      <p className="text-xs font-medium mb-2" style={{ color: "#50596e" }}>{label}</p>
      <p className="text-2xl font-bold tabular-nums" style={{ color: color || "var(--text-1)", fontFamily: "var(--font-mono)" }}>{value}</p>
      {badge && (
        <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: badge.color + "22", color: badge.color }}>{badge.text}</span>
      )}
      {!badge && sub && <p className="text-xs mt-1" style={{ color: "#50596e" }}>{sub}</p>}
    </div>
  );
}

function ProbBar({ prob, color }: { prob: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(prob), 100); return () => clearTimeout(t); }, [prob]);
  return (
    <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
      <div className="absolute left-0 top-0 h-full rounded-full"
        style={{ width: `${width}%`, background: color, boxShadow: `0 0 10px ${color}80`, transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

export default function RiskDashboard({ result, onReset, patientData }: Props) {
  const meta = RISK_META[result.risk_level];
  const prob = result.risk_probability * 100;
  const probStr = prob.toFixed(1);
  const bmi = bmiClass(result.bmi);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Alert banner */}
      <div className="anim-fade-up rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
            style={{ background: meta.color + "30", color: meta.color }}>{meta.icon}</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: meta.color }}>{result.risk_level}</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{meta.desc}</p>
          </div>
        </div>
        <button onClick={onReset} className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
          New Assessment
        </button>
      </div>

      {/* Gauge + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 glow-card p-6 flex flex-col items-center justify-center anim-fade-up d1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#50596e" }}>Risk Score</p>
          <RiskGauge score={result.risk_score} level={result.risk_level} />
        </div>
        <div className="md:col-span-3 grid grid-cols-2 gap-3 content-start">
          <StatCard label="Risk Probability" value={`${probStr}%`} sub="model confidence" color={meta.color} delay="d2" />
          <StatCard
            label="BMI"
            value={String(result.bmi)}
            sub="kg / m²"
            color={bmi.color}
            delay="d3"
            badge={{ text: bmi.label, color: bmi.color }}
          />
          <StatCard label="Risk Category"  value={result.risk_level.split(" ")[0]} sub={`Score ${result.risk_score} / 100`} color={meta.color} delay="d4" />
          <StatCard label="Action Items"   value={String(result.recommendations.length)} sub="recommendations" delay="d5" />
        </div>
      </div>

      {/* Probability bar */}
      <div className="glow-card p-5 anim-fade-up d3">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#50596e" }}>Probability Breakdown</p>
          <span className="text-sm font-bold tabular-nums" style={{ color: meta.color, fontFamily: "var(--font-mono)" }}>{probStr}%</span>
        </div>
        <ProbBar prob={prob} color={meta.color} />
        <div className="flex justify-between mt-2 text-xs" style={{ color: "#50596e" }}>
          <span>0% — No risk</span>
          <span style={{ color: "#f59e0b" }}>35% — Threshold</span>
          <span>100% — Certain</span>
        </div>
      </div>

      {/* Charts */}
      <div className="anim-fade-up d4">
        <HealthCharts result={result} patientData={patientData} />
      </div>

      {/* Recommendations */}
      <div className="glow-card p-6 anim-fade-up d5 mb-8">
        <RecommendationCards recommendations={result.recommendations} />
      </div>
    </div>
  );
}