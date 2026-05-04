"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { useEffect, useState } from "react";

const founders = [
  {
    name: "Dr. Kiran Khatter",
    role: "Co-Founder",
    initials: "KK",
    focus: "Learning Architecture",
    description:
      "Focused on building meaningful learning experiences that make DSA concepts easier to understand through clarity, structure, and intuition.",
    accent: "#6366f1",
    accentLight: "#4f46e5",
  },
  {
    name: "Maheshwar Dwivedy",
    role: "Co-Founder",
    initials: "MD",
    focus: "Technology & Education",
    description:
      "Passionate about combining technology and education to help learners explore problem solving in a more visual and approachable way.",
    accent: "#8b5cf6",
    accentLight: "#7c3aed",
  },
  {
    name: "Aaradhya Gupta",
    role: "Co-Founder",
    initials: "AG",
    focus: "Design & Interaction",
    description:
      "Works on shaping a learner-first platform where design, simplicity, and interactivity come together for better conceptual understanding.",
    accent: "#a855f7",
    accentLight: "#9333ea",
  },
  {
    name: "Agrima Agarwal",
    role: "Co-Founder",
    initials: "AA",
    focus: "Product Vision",
    description:
      "Driven by the vision of making data structures and algorithms feel less intimidating and more intuitive for every student.",
    accent: "#7c3aed",
    accentLight: "#6d28d9",
  },
];

const stats = [
  { value: "50+", label: "Algorithms Visualized" },
  { value: "10K+", label: "Learners Helped" },
  { value: "4", label: "Co-Founders" },
  { value: "∞", label: "Concepts to Explore" },
];

const missionPoints = [
  {
    emoji: "🎯",
    title: "Stop guessing. Start seeing.",
    body: "Most students fail DSA not because they're not smart  but because nobody showed them how it actually works. We fix that with step-by-step visuals.",
  },
  {
    emoji: "💡",
    title: "That 'aha!' moment, every time.",
    body: "We build AlgoMaitri so every student gets that moment where everything suddenly makes sense. Not just for the exam forever.",
  },
  {
    emoji: "🚀",
    title: "From confused to confident.",
    body: "Whether you're a beginner or prepping for FAANG, AlgoMaitri meets you where you are and helps you level up  one algorithm at a time.",
  },
];

export default function AboutPage() {
  const [isDark, setIsDark] = useState(true);

  // Sync with actual document theme
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const t = {
    bg: isDark ? "#0a0a0f" : "#f4f4f8",
    surface: isDark ? "#111118" : "#ffffff",
    surfaceHover: isDark ? "#18181f" : "#f9f9fc",
    border: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    borderStrong: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.14)",
    text: isDark ? "#e8e8f0" : "#111118",
    textMuted: isDark ? "rgba(232,232,240,0.5)" : "rgba(17,17,24,0.5)",
    textFaint: isDark ? "rgba(232,232,240,0.25)" : "rgba(17,17,24,0.25)",
    cardNumColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
    gridLine: isDark ? "rgba(99,102,241,0.04)" : "rgba(99,102,241,0.06)",
    glow1: isDark
      ? "rgba(99,102,241,0.12)"
      : "rgba(99,102,241,0.07)",
    glow2: isDark
      ? "rgba(139,92,246,0.10)"
      : "rgba(139,92,246,0.06)",
    missionBg: isDark ? "rgba(99,102,241,0.07)" : "rgba(99,102,241,0.05)",
    missionBorder: isDark
      ? "rgba(99,102,241,0.18)"
      : "rgba(99,102,241,0.2)",
    statsBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
    statsBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  };

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: t.bg, color: t.text, transition: "background 0.3s, color 0.3s" }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "fixed", inset: 0,
          backgroundImage: `linear-gradient(${t.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none", zIndex: 0,
        }}
      />
      {/* Glow orbs */}
      <div style={{ position: "fixed", top: "-8%", left: "-4%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${t.glow1} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-4%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${t.glow2} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <div className="relative z-10 flex min-h-screen flex-col" style={{ padding: "1.5rem 1.5rem 5rem" }}>
        <Navbar />

        {/* Back nav */}
        <div style={{ maxWidth: 1200, margin: "2.5rem auto 0", width: "100%" }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textMuted, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500, transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = t.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = t.textMuted)}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        {/* ── HERO ── */}
        <section style={{ maxWidth: 1200, margin: "3rem auto 0", width: "100%" }}>
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
            <div style={{ width: 32, height: 1, background: "rgba(99,102,241,0.7)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366f1", fontWeight: 700 }}>
              About AlgoMaitri
            </span>
          </div>

          {/* Big headline */}
          <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", margin: "0 0 2.5rem" }}>
            <span style={{ color: t.text, display: "block" }}>Making DSA</span>
            <span style={{ display: "block", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              click with you.
            </span>
          </h1>

          {/* Two-col: text + stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ fontSize: "1.15rem", lineHeight: 1.75, color: t.textMuted, margin: 0, maxWidth: 480 }}>
                AlgoMaitri is built on a simple belief  that everyone can understand data structures and algorithms when they can actually <em>see</em> them working. We design for the moment things finally click.
              </p>
              <p style={{ fontSize: "1rem", lineHeight: 1.75, color: t.textFaint, margin: 0, maxWidth: 480 }}>
                Our platform bridges the gap between theory and intuition, replacing rote memorization with visual, step-by-step exploration that sticks.
              </p>
              <div style={{ paddingTop: 8 }}>
                <Link
                  href="/visualizer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 100, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", transition: "opacity 0.2s, transform 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Explore Visualizer <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: t.statsBorder, borderRadius: 16, overflow: "hidden", border: `1px solid ${t.statsBorder}` }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ padding: "1.8rem 1.5rem", background: isDark ? "rgba(255,255,255,0.02)" : "#ffffff", display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.04em", background: "linear-gradient(135deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>
                    {stat.value}
                  </span>
                  <span style={{ fontSize: 11, color: t.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: 1200, margin: "5rem auto", width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }} />

        {/* ── MISSION ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "rgba(99,102,241,0.7)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366f1", fontWeight: 700 }}>Our Mission</span>
          </div>

          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 2.5rem", color: t.text, lineHeight: 1.05 }}>
            We built this for every student
            <br />
            <span style={{ color: t.textMuted, fontWeight: 500 }}>who ever said "I'm just not a CS person."</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {missionPoints.map((point) => (
              <div
                key={point.title}
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: "2rem", display: "flex", flexDirection: "column", gap: 14, transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(99,102,241,0.4)";
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = isDark ? "0 12px 40px rgba(99,102,241,0.12)" : "0 12px 40px rgba(99,102,241,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = t.border;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: 32 }}>{point.emoji}</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em", color: t.text, margin: 0, lineHeight: 1.3 }}>{point.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: t.textMuted, margin: 0 }}>{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: 1200, margin: "5rem auto", width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }} />

        {/* ── TEAM ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 1, background: "rgba(99,102,241,0.7)" }} />
                <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366f1", fontWeight: 700 }}>The Team</span>
              </div>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", margin: 0, lineHeight: 1, color: t.text }}>
                Four minds,<br />one mission.
              </h2>
            </div>
            <p style={{ maxWidth: 340, fontSize: "0.95rem", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              A cross-functional founding team united by the belief that learning algorithms shouldn't be painful.
            </p>
          </div>

          {/* Founder cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: t.border, borderRadius: 24, overflow: "hidden", border: `1px solid ${t.border}` }}>
            {founders.map((founder, i) => (
              <div
                key={founder.name}
                style={{ background: t.surface, padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: 20, transition: "background 0.2s", cursor: "default", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = t.surfaceHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = t.surface; }}
              >
                {/* Big visible number */}
                <span style={{ position: "absolute", top: 12, right: 18, fontSize: 72, fontWeight: 900, color: t.cardNumColor, letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none", fontVariantNumeric: "tabular-nums", transition: "color 0.3s" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Initials badge */}
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${founder.accent}25, ${founder.accent}45)`, border: `1.5px solid ${founder.accent}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: founder.accent, letterSpacing: "-0.02em", flexShrink: 0 }}>
                  {founder.initials}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: founder.accent, fontWeight: 700 }}>
                    {founder.focus}
                  </span>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: t.text, lineHeight: 1.2 }}>
                    {founder.name}
                  </h3>
                  <span style={{ fontSize: 11, color: t.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                    {founder.role}
                  </span>
                </div>

                <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: t.textMuted, margin: 0 }}>
                  {founder.description}
                </p>

                {/* Bottom accent line */}
                <div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${founder.accent}70, transparent)`, marginTop: "auto" }} />
              </div>
            ))}
          </div>
        </section>

        {/* ── CLOSING MANIFESTO ── */}
        <section style={{ maxWidth: 1200, margin: "5rem auto 0", width: "100%", padding: "3rem 2.5rem", borderRadius: 24, background: t.missionBg, border: `1px solid ${t.missionBorder}`, display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.65rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: t.text, lineHeight: 1.35, maxWidth: 560 }}>
              "You don't need to be a genius.{" "}
              <span style={{ color: t.textMuted, fontWeight: 500 }}>
                You just need to see it. That's what AlgoMaitri is here for."
              </span>
            </p>
          </div>
          <Link
            href="/visualizer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", border: `1px solid rgba(99,102,241,0.4)`, borderRadius: 100, color: isDark ? "rgba(232,232,240,0.85)" : "#111118", textDecoration: "none", fontSize: 14, fontWeight: 700, letterSpacing: "0.02em", whiteSpace: "nowrap", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
          >
            Start Learning <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
    </main>
  );
}
