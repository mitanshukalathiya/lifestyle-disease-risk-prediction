"use client";
import { useEffect, useState } from "react";
import { RiskLevel } from "@/types";

const COLORS: Record<RiskLevel, string> = {
  "Low Risk":    "#10b981",
  "Medium Risk": "#f59e0b",
  "High Risk":   "#ef4444",
};

// Gauge geometry
const CX = 130, CY = 130, R = 100;
const TRACK_START = 150; // degrees
const SWEEP = 240;       // degrees
const CIRC = (SWEEP / 360) * 2 * Math.PI * R;

const toRad = (d: number) => (d * Math.PI) / 180;
const ptOnCircle = (deg: number, r = R) => ({
  x: CX + r * Math.cos(toRad(deg % 360)),
  y: CY + r * Math.sin(toRad(deg % 360)),
});

// Full 240° arc path (large-arc = 1 because sweep > 180)
function fullArc() {
  const s = ptOnCircle(TRACK_START);
  const e = ptOnCircle(TRACK_START + SWEEP);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 1 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

// Partial arc for zones (always < 120° so large-arc = 0)
function zoneArc(from: number, to: number) {
  const s = ptOnCircle(from);
  const e = ptOnCircle(to);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

export default function RiskGauge({ score, level }: { score: number; level: RiskLevel }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(score / 100), 200);
    return () => clearTimeout(t);
  }, [score]);

  const color = COLORS[level];

  // strokeDashoffset: 0 = fully drawn, CIRC = fully hidden
  const dashOffset = CIRC * (1 - progress);

  // Needle: line from centre pointing to arc position
  // const needleDeg = TRACK_START + progress * SWEEP;
  // const tip  = ptOnCircle(needleDeg, R - 8);
  // const base = ptOnCircle(needleDeg, 18);

  const lowEnd  = TRACK_START + 0.30 * SWEEP; // 222°
  const midEnd  = TRACK_START + 0.60 * SWEEP; // 294°

  return (
    <div className="flex flex-col items-center">
      <svg width="260" height="200" viewBox="0 0 260 200">
        <defs>
          <filter id="gGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path d={fullArc()} fill="none" stroke="#ffffff0d" strokeWidth="14" strokeLinecap="round"/>

        {/* Zone tints */}
        <path d={zoneArc(TRACK_START, lowEnd)} fill="none" stroke="#10b98124" strokeWidth="14" strokeLinecap="round"/>
        <path d={zoneArc(lowEnd, midEnd)}       fill="none" stroke="#f59e0b24" strokeWidth="14" strokeLinecap="round"/>
        <path d={zoneArc(midEnd, TRACK_START + SWEEP)} fill="none" stroke="#ef444424" strokeWidth="14" strokeLinecap="round"/>

        {/* Progress arc — animates via strokeDashoffset */}
        <path
          d={fullArc()}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          filter="url(#gGlow)"
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.34,1.05,0.64,1), stroke 0.4s" }}
        />

        {/* Needle — SVG line, position updated by re-rendering
        <line
          x1={base.x.toFixed(2)} y1={base.y.toFixed(2)}
          x2={tip.x.toFixed(2)}  y2={tip.y.toFixed(2)}
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#gGlow)"
        />
        {/* Needle pivot */}
        {/* <circle cx={CX} cy={CY} r="7" fill="var(--surface-3,#1f2640)" stroke={color} strokeWidth="2"/> */}

        {/* Score text */}
        <text x={CX} y={CY - 10} textAnchor="middle" fontSize="38" fontWeight="700"
          fontFamily="var(--font-mono)" fill={color}>{score}</text>
        <text x={CX} y={CY + 14} textAnchor="middle" fontSize="12"
          fontFamily="var(--font-sans)" fill="#50596e">out of 100</text>

        {/* Zone labels */}
        <text x="12"  y="180" textAnchor="middle" fontSize="10" fontWeight="600" fill="#10b981" fontFamily="var(--font-sans)">LOW</text>
        <text x={CX}  y="12"  textAnchor="middle" fontSize="10" fontWeight="600" fill="#f59e0b" fontFamily="var(--font-sans)">MED</text>
        <text x="248" y="180" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ef4444" fontFamily="var(--font-sans)">HIGH</text>
      </svg>

      <div className="mt-1 px-5 py-1.5 rounded-full text-sm font-semibold"
        style={{ background: color + "20", color, border: `1px solid ${color}40` }}>
        {level}
      </div>
    </div>
  );
}