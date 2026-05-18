"use client";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { PredictionResponse } from "@/types";

interface Props { result: PredictionResponse; patientData: Record<string, number>; }

const T3 = "#50596e", T2 = "#8892aa";
const SURFACE3 = "#1f2640", BORDER2 = "#2a3350";
const CYAN = "#22d3ee", GREEN = "#10b981", AMBER = "#f59e0b", RED = "#ef4444";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value:number;name:string}[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: SURFACE3, border: `1px solid ${BORDER2}`, borderRadius: 10, padding: "8px 12px" }}>
      <div style={{ color: T2, fontSize: 11, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: CYAN, fontSize: 12, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

const bpColor = (v: number, normal: number) =>
  v > normal * 1.25 ? RED : v > normal * 1.05 ? AMBER : GREEN;

export default function HealthCharts({ result, patientData }: Props) {
  // Radar: normalise each factor 0–100 where 100 = worst
  const radarData = [
    { subject: "BP",          value: Math.min(100, Math.max(0, ((patientData.ap_hi - 90) / 110) * 100)) },
    { subject: "BMI",         value: Math.min(100, Math.max(0, ((result.bmi - 18.5) / 21.5) * 100)) },
    { subject: "Cholesterol", value: ((patientData.cholesterol - 1) / 2) * 100 },
    { subject: "Glucose",     value: ((patientData.gluc - 1) / 2) * 100 },
    { subject: "Inactivity",  value: patientData.active === 0 ? 85 : 5 },
    { subject: "Smoking",     value: patientData.smoke === 1 ? 90 : 0 },
  ];

  // BP chart: one row per reading, with patient value + normal reference
  const bpData = [
    { name: "Systolic",  patient: patientData.ap_hi, normal: 120 },
    { name: "Diastolic", patient: patientData.ap_lo, normal: 80  },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Radar */}
      <div className="glow-card p-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: T3 }}>Risk Factor Radar</p>
        <p className="text-xs mb-3" style={{ color: T3 }}>Higher = greater risk contribution</p>
        <ResponsiveContainer width="100%" height={210}>
          <RadarChart data={radarData} outerRadius={72}>
            <PolarGrid stroke="#ffffff08" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: T2, fontSize: 11 }} />
            <Radar dataKey="value" stroke={CYAN} fill={CYAN} fillOpacity={0.12} strokeWidth={1.5} dot={{ fill: CYAN, r: 3 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* BP bar — patient bars rendered with Cell, reference lines for limits */}
      <div className="glow-card p-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: T3 }}>Blood Pressure vs Normal</p>
        <p className="text-xs mb-3" style={{ color: T3 }}>Dashed lines = healthy upper limits</p>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={bpData} barCategoryGap="45%" margin={{ right: 28 }}>
            <XAxis dataKey="name" tick={{ fill: T2, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T3, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 240]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface)" }} />
            <ReferenceLine y={120} stroke={GREEN} strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: "120", fill: GREEN, fontSize: 10, position: "right" }} />
            <ReferenceLine y={80} stroke={AMBER} strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: "80", fill: AMBER, fontSize: 10, position: "right" }} />
            <Bar dataKey="patient" name="mmHg" radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={true}>
              {bpData.map((d, i) => (
                <Cell key={i} fill={bpColor(d.patient, d.normal)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-1">
          {[[GREEN,"Normal"],[AMBER,"Elevated"],[RED,"High"]].map(([c,l]) => (
            <div key={String(l)} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: String(c) }} />
              <span style={{ color: T3, fontSize: 11 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}