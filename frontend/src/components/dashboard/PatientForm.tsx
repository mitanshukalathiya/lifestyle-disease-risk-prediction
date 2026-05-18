"use client";
import { useState } from "react";
import { PatientInput } from "@/types";

interface Props { onSubmit: (d: PatientInput) => void; loading: boolean; }

/* ── SVG icons ─────────────────────────────────────────────── */
const Icon = ({ n }: { n: string }) => {
  const paths: Record<string, React.ReactNode> = {
    user:   <><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    heart:  <><path d="M10 17s-7-4.5-7-9a5 5 0 0110 0 5 5 0 0110 0c0 4.5-7 9-7 9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>,
    flask:  <><path d="M8 3v6l-4 7h12l-4-7V3M6 3h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    run:    <><circle cx="13" cy="4" r="1.5" fill="currentColor"/><path d="M9 8l2-2 2 2 3 1M9 8l-2 5 3 1 1 4M11 13l3-1 1 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    smoke:  <><path d="M3 14h12M3 10h12M17 10a2 2 0 000-4c0-1.5-1-2.5-2-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    wine:   <><path d="M8 3h8m-7 0l-1 7h8l-1-7M7 10c0 3 2 5 5 5s5-2 5-5M12 15v5M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    male:   <><circle cx="9" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M13 3h5v5M18 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    female: <><circle cx="11" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 14.5V20M8 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
  };
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none">{paths[n]}</svg>;
};

/* ── BP classification ──────────────────────────────────────── */
function getBpCategory(sys: number, dia: number) {
  if (sys > 180 || dia > 120)  return { label: "Hypertensive Crisis", color: "#7c3aed" };
  if (sys >= 140 || dia >= 90) return { label: "Stage 2 Hypertension", color: "#ef4444" };
  if (sys >= 130 || dia >= 80) return { label: "Stage 1 Hypertension", color: "#f97316" };
  if (sys >= 120 && dia < 80)  return { label: "Elevated",             color: "#f59e0b" };
  if (sys < 90  || dia < 60)   return { label: "Low (Hypotension)",    color: "#3b82f6" };
  return                               { label: "Normal",               color: "#10b981" };
}

/* ── Lab colour (3-tier) ────────────────────────────────────── */
function labColor(val: number): string {
  if (val === 1) return "#22d3ee";  // Normal  → cyan
  if (val === 2) return "#f59e0b";  // Above   → amber
  return "#ef4444";                 // Well above → red
}

/* ── Slider with +/- buttons ────────────────────────────────── */
function SliderField({
  label, unit, min, max, step = 1, value, onChange, trackColor, valueDisplay,
}: {
  label: string; unit?: string; min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void;
  trackColor?: string; valueDisplay?: { text: string; color: string };
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const fill = trackColor ?? "var(--cyan)";
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm" style={{ color: "var(--text-2)" }}>{label}</span>
        <span className="text-sm font-semibold tabular-nums px-2 py-0.5 rounded-md"
          style={{ background: (valueDisplay?.color ?? "var(--cyan)") + "22", color: valueDisplay?.color ?? "var(--cyan)", fontFamily: "var(--font-mono)" }}>
          {valueDisplay?.text ?? `${value}${unit ? " " + unit : ""}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - step))}
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-all hover:opacity-80 select-none"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>−</button>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          style={{ background: `linear-gradient(to right, ${fill} ${pct}%, var(--surface-3) ${pct}%)`, flex: 1 }} />
        <button type="button" onClick={() => onChange(clamp(value + step))}
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-all hover:opacity-80 select-none"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>+</button>
      </div>
    </div>
  );
}

/* ── Toggle ─────────────────────────────────────────────────── */
function Toggle({ label, icon, value, onChange }:
  { label: string; icon: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all"
      style={{ background: value ? "var(--cyan-dim)" : "var(--surface-2)", border: `1px solid ${value ? "rgba(34,211,238,0.3)" : "var(--border)"}` }}>
      <span style={{ color: value ? "var(--cyan)" : "var(--text-3)" }}><Icon n={icon} /></span>
      <span className="flex-1 text-sm text-left font-medium" style={{ color: value ? "var(--text-1)" : "var(--text-2)" }}>{label}</span>
      <div className="relative rounded-full flex-shrink-0" style={{ width:40, height:22, background: value ? "var(--cyan)" : "var(--surface-3)", transition:"background 0.2s" }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
          style={{ left: 2, width:18, height:18, transition:"transform 0.2s", transform: value ? "translateX(18px)" : "translateX(0)" }} />
      </div>
    </button>
  );
}

/* ── Section card ───────────────────────────────────────────── */
function SectionCard({ icon, title, children, delay }: { icon: string; title: string; children: React.ReactNode; delay: string }) {
  return (
    <div className={`glow-card p-5 anim-fade-up ${delay}`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--cyan-dim)", color: "var(--cyan)" }}><Icon n={icon} /></div>
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>{title}</h3>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

/* ── BMI badge ──────────────────────────────────────────────── */
function BmiBadge({ bmi }: { bmi: number }) {
  const { label, color } = bmi < 18.5 ? { label: "Underweight", color: "var(--amber)" }
    : bmi < 25 ? { label: "Normal", color: "var(--green)" }
    : bmi < 30 ? { label: "Overweight", color: "var(--amber)" }
    : { label: "Obese", color: "var(--red)" };
  return (
    <div className="glow-card p-5 flex flex-col items-center justify-center anim-fade-up d5" style={{ minHeight: 180 }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>BMI Preview</p>
      <div className="text-5xl font-bold tabular-nums mb-1" style={{ color, fontFamily: "var(--font-mono)" }}>{bmi}</div>
      <div className="text-xs mb-3" style={{ color: "var(--text-3)" }}>kg / m²</div>
      <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: color + "22", color }}>{label}</span>
    </div>
  );
}

/* ── Main form ──────────────────────────────────────────────── */
export default function PatientForm({ onSubmit, loading }: Props) {
  const [v, setV] = useState({
    age_years: 45, gender: 2, height: 170, weight: 75,
    ap_hi: 125, ap_lo: 82, cholesterol: 1, gluc: 1,
    smoke: 0, alco: 0, active: 1,
  });
  const [bpErr, setBpErr] = useState("");

  const set = (k: string, val: number) => {
    setV(p => ({ ...p, [k]: val }));
    if (k === "ap_hi" || k === "ap_lo") setBpErr("");
  };

  const bmi = +(v.weight / ((v.height / 100) ** 2)).toFixed(1);
  const bpCat = getBpCategory(v.ap_hi, v.ap_lo);
  const pulsePressure = v.ap_hi - v.ap_lo;
  const ppWarn = pulsePressure < 40 || pulsePressure > 60;

  const LAB_LABELS = ["Normal", "Above Normal", "Well Above"];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (v.ap_hi <= v.ap_lo) { setBpErr("Systolic must be greater than diastolic."); return; }
    onSubmit(v as unknown as PatientInput);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 anim-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full" style={{ background: "var(--cyan)" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--cyan)" }}>Patient Assessment</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--text-1)" }}>Cardiovascular Risk Analysis</h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Enter patient health indicators. All fields are required for accurate AI-based risk prediction.</p>
      </div>

      <form onSubmit={submit}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">

          {/* Demographics */}
          <SectionCard icon="user" title="Demographics" delay="d1">
            <SliderField label="Age" unit="yrs" min={18} max={90} value={v.age_years} onChange={val => set("age_years", val)} />
            <SliderField label="Height" unit="cm" min={140} max={220} value={v.height} onChange={val => set("height", val)} />
            <SliderField label="Weight" unit="kg" min={30} max={200} value={v.weight} onChange={val => set("weight", val)} />
          </SectionCard>

          {/* Blood Pressure */}
          <SectionCard icon="heart" title="Blood Pressure" delay="d2">
            <SliderField
              label="Systolic (ap_hi)" unit="mmHg" min={80} max={250} value={v.ap_hi}
              onChange={val => set("ap_hi", val)}
              trackColor={bpCat.color}
              valueDisplay={{ text: `${v.ap_hi} mmHg`, color: bpCat.color }}
            />
            <SliderField
              label="Diastolic (ap_lo)" unit="mmHg" min={40} max={160} value={v.ap_lo}
              onChange={val => set("ap_lo", val)}
              trackColor={bpCat.color}
              valueDisplay={{ text: `${v.ap_lo} mmHg`, color: bpCat.color }}
            />
            {bpErr && <p className="text-xs rounded-lg px-3 py-2" style={{ background: "var(--red-dim)", color: "var(--red)" }}>{bpErr}</p>}

            {/* BP readout + category */}
            <div className="rounded-xl p-3" style={{ background: "var(--surface-2)" }}>
              <div className="text-lg font-bold tabular-nums text-center mb-1"
                style={{ color: bpCat.color, fontFamily: "var(--font-mono)" }}>{v.ap_hi} / {v.ap_lo}</div>
              <div className="text-center text-xs font-semibold mb-2" style={{ color: bpCat.color }}>{bpCat.label}</div>
              <div className="flex justify-between items-center text-xs" style={{ color: "var(--text-3)" }}>
                <span>Pulse pressure</span>
                <span className="font-semibold tabular-nums" style={{ color: ppWarn ? "var(--red)" : "var(--green)", fontFamily: "var(--font-mono)" }}>
                  {pulsePressure} mmHg
                </span>
              </div>
              {ppWarn && (
                <p className="text-xs mt-1.5 rounded-lg px-2 py-1.5" style={{ background: "var(--red-dim)", color: "var(--red)" }}>
                  {pulsePressure < 40 ? "Low pulse pressure — possible aortic stenosis or shock." : "High pulse pressure — possible arterial stiffness or aortic regurgitation."}
                </p>
              )}
            </div>
          </SectionCard>

          {/* Lab Results */}
          <SectionCard icon="flask" title="Lab Results" delay="d3">
            <SliderField
              label="Cholesterol" min={1} max={3} value={v.cholesterol}
              onChange={val => set("cholesterol", val)}
              trackColor={labColor(v.cholesterol)}
              valueDisplay={{ text: LAB_LABELS[v.cholesterol - 1], color: labColor(v.cholesterol) }}
            />
            <SliderField
              label="Glucose" min={1} max={3} value={v.gluc}
              onChange={val => set("gluc", val)}
              trackColor={labColor(v.gluc)}
              valueDisplay={{ text: LAB_LABELS[v.gluc - 1], color: labColor(v.gluc) }}
            />
            {/* Preventive notes */}
            {/* {v.cholesterol > 1 && (
              <p className="text-xs rounded-lg px-2 py-1.5" style={{ background: v.cholesterol === 3 ? "var(--red-dim)" : "var(--amber-dim)", color: v.cholesterol === 3 ? "var(--red)" : "var(--amber)" }}>
                {v.cholesterol === 3 ? "Severely elevated — consider statins and dietary review." : "Elevated cholesterol — reduce saturated fats, increase fiber."}
              </p>
            )}
            {v.gluc > 1 && (
              <p className="text-xs rounded-lg px-2 py-1.5" style={{ background: v.gluc === 3 ? "var(--red-dim)" : "var(--amber-dim)", color: v.gluc === 3 ? "var(--red)" : "var(--amber)" }}>
                {v.gluc === 3 ? "Severely elevated — urgent diabetes screening recommended." : "Elevated glucose — reduce sugar intake, monitor regularly."}
              </p>
            )} */}
          </SectionCard>

          <BmiBadge bmi={bmi} />
        </div>

        {/* Row 2: Gender + Lifestyle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glow-card p-5 anim-fade-up d6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--cyan-dim)", color: "var(--cyan)" }}>
                <Icon n="user" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>Gender</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ val: 1, label: "Female", icon: "female" }, { val: 2, label: "Male", icon: "male" }].map(({ val, label, icon }) => (
                <button key={val} type="button" onClick={() => set("gender", val)}
                  className="flex flex-col items-center gap-2 py-5 rounded-xl transition-all"
                  style={{ background: v.gender === val ? "var(--cyan-dim)" : "var(--surface-2)", border: `1px solid ${v.gender === val ? "rgba(34,211,238,0.4)" : "var(--border)"}`, color: v.gender === val ? "var(--cyan)" : "var(--text-2)" }}>
                  <Icon n={icon} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glow-card p-5 anim-fade-up d7">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--cyan-dim)", color: "var(--cyan)" }}>
                <Icon n="run" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>Lifestyle Factors</h3>
            </div>
            <div className="space-y-2.5">
              <Toggle label="Physically Active" icon="run"   value={v.active === 1} onChange={b => set("active", b ? 1 : 0)} />
              <Toggle label="Smoker"            icon="smoke" value={v.smoke === 1}  onChange={b => set("smoke",  b ? 1 : 0)} />
              <Toggle label="Alcohol Use"       icon="wine"  value={v.alco === 1}   onChange={b => set("alco",   b ? 1 : 0)} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 anim-fade-up d8"
          style={{ background: "linear-gradient(135deg, #22d3ee, #0ea5e9)", color: "#0a0d14", boxShadow: "0 0 32px rgba(34,211,238,0.25)" }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2.5">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="rgba(0,0,0,0.3)" strokeWidth="2"/>
                <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Analysing patient data…
            </span>
          ) : "Run Cardiovascular Risk Assessment →"}
        </button>
      </form>
    </div>
  );
}