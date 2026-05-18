"use client";

const ICONS: Record<string, string> = {
  weight: "⚖", blood: "💉", cholesterol: "🩸", sugar: "🍬",
  activity: "🏃", smoke: "🚭", alcohol: "🍷", general: "✓",
};

function getIcon(rec: string) {
  const r = rec.toLowerCase();
  if (r.includes("weight")) return ICONS.weight;
  if (r.includes("blood") || r.includes("pressure")) return ICONS.blood;
  if (r.includes("cholesterol") || r.includes("fat")) return ICONS.cholesterol;
  if (r.includes("sugar") || r.includes("glucose")) return ICONS.sugar;
  if (r.includes("activ") || r.includes("exercise")) return ICONS.activity;
  if (r.includes("smok")) return ICONS.smoke;
  if (r.includes("alcohol")) return ICONS.alcohol;
  return ICONS.general;
}

export default function RecommendationCards({ recommendations }: { recommendations: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#50596e" }}>
        Preventive Recommendations
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex gap-3 items-start rounded-xl p-4 anim-fade-up"
            style={{ animationDelay: `${i * 0.07}s`, background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--cyan-dim)", border: "1px solid rgba(34,211,238,0.2)", fontSize: 16, lineHeight: 1 }}
            >
              {getIcon(rec)}
            </div>
            <p className="text-sm leading-relaxed pt-0.5" style={{ color: "#8892aa" }}>{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}