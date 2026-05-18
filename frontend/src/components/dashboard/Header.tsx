"use client";
import { useEffect, useState } from "react";

interface Props { onReset?: () => void; }

export default function Header({ onReset }: Props) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  return (
    <header className="relative z-50 border-b" style={{ background: "rgba(var(--bg-rgb,10,13,20),0.9)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#22d3ee,#0ea5e9)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="8" cy="8" r="6.2" stroke="white" strokeWidth="1" opacity="0.5"/>
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "rgb(240, 244, 255)" }}>CardioScan</span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: "var(--cyan-dim)", color: "var(--cyan)", fontFamily: "var(--font-mono)" }}>AI</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: "var(--text-3)" }}>
            <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:"#10b981", boxShadow:"0 0 6px #10b981", animation:"pulseRing 2s ease infinite" }}/>
            Model online
          </div>

          {/* Day / Night toggle */}
          <button
            onClick={() => setDark(d => !d)}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}
          >
            {dark ? (
              /* Sun icon */
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <path d="M17 12a7 7 0 11-9-9 5.5 5.5 0 109 9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            )}
            {dark ? "Day" : "Night"}
          </button>

          {onReset && (
            <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6a4 4 0 104-4H4m0 0L2 4m2-2L2 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New assessment
            </button>
          )}
        </div>
      </div>
    </header>
  );
}