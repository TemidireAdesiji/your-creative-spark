import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope, FlaskConical, Gamepad2, ScanEye, TrendingUp,
  Users, ShieldAlert, ArrowRight, ChevronDown,
  LayoutDashboard, Monitor, BarChart3,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import RevealSection from "@/components/landing/RevealSection";
import { useScrollReveal } from "@/components/landing/useScrollReveal";

const TEAL = "#1DA39A";
const DARK = "#0E0E0E";
const WARM_GRAY = "#F5F3F0";
const AMBER = "#E6A817";
const PURPLE = "#7C5CBF";
const FONT = "'Poppins', sans-serif";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ─── Heading ─── */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: FONT, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: DARK, marginBottom: 48, textAlign: "center" }}>
    {children}
  </h2>
);

/* ─── Animated card ─── */
const AnimatedCard = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => {
  const { ref, visible } = useScrollReveal(0.15);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: `all 0.5s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ================================================================ HERO ================================================================ */
const Hero = () => {
  const { ref, visible } = useScrollReveal(0.05);
  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #0a2e2b 50%, ${TEAL} 100%)`,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: 96,
        paddingBottom: 60,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <div style={{ maxWidth: 760 }}>
        <img
          src="/images/app-logo.png"
          alt="Motion.ly logo"
          style={{
            width: 80, height: 80, borderRadius: 18,
            marginBottom: 32, marginLeft: "auto", marginRight: "auto", display: "block",
            boxShadow: `0 0 40px ${TEAL}66`,
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.8)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        <h1
          style={{
            fontFamily: FONT, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800,
            lineHeight: 1.15, color: "#fff", marginBottom: 24,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s ease 0.2s",
          }}
        >
          Track neurodegenerative symptoms through research‑grade, gamified tasks.
        </h1>
        <p
          style={{
            fontFamily: FONT, fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(255,255,255,0.78)", lineHeight: 1.7,
            maxWidth: 620, margin: "0 auto 40px",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s ease 0.4s",
          }}
        >
          Motion.ly helps clinicians and researchers measure changes in movement
          and cognition using AI‑assisted tasks and computer‑vision signals
          (e.g.&nbsp;MediaPipe pose and hand tracking).
        </p>

        <div
          style={{
            display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s ease 0.6s",
          }}
        >
          <Link
            to="/app"
            style={{
              background: TEAL, color: "#fff", fontFamily: FONT, fontWeight: 600,
              fontSize: "1.05rem", padding: "14px 36px", borderRadius: 10,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: `0 4px 20px ${TEAL}55`, transition: "transform .15s",
            }}
          >
            Launch Demo <ArrowRight size={18} />
          </Link>
          <button
            onClick={() => scrollTo("how-it-works")}
            style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontFamily: FONT, fontWeight: 500, fontSize: "1.05rem",
              padding: "14px 32px", borderRadius: 10, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            See how it works <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

/* ================================================================ WHO IT'S FOR ================================================================ */
const personas = [
  { icon: <Stethoscope size={32} color={TEAL} />, title: "Clinicians", desc: "Monitor progression of Parkinson's, ALS, and more with repeatable tasks instead of subjective notes.", accent: TEAL },
  { icon: <FlaskConical size={32} color={AMBER} />, title: "Researchers", desc: "Run longitudinal studies with digital tasks and standardized metrics—no expensive lab equipment needed.", accent: AMBER },
  { icon: <Users size={32} color={PURPLE} />, title: "Patients & Participants", desc: "Play simple games that translate into useful movement and cognitive data—at home or in clinic.", accent: PURPLE },
];

const WhoItsFor = () => (
  <RevealSection id="who-its-for" bg={WARM_GRAY}>
    <SectionHeading>Who it's for</SectionHeading>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
      {personas.map((p, i) => (
        <AnimatedCard key={p.title} delay={i * 120} style={{ background: "#fff", borderRadius: 14, padding: "36px 28px", borderTop: `4px solid ${p.accent}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ marginBottom: 16 }}>{p.icon}</div>
          <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1.15rem", marginBottom: 10, color: DARK }}>{p.title}</h3>
          <p style={{ fontFamily: FONT, fontSize: "0.95rem", color: "#555", lineHeight: 1.6 }}>{p.desc}</p>
        </AnimatedCard>
      ))}
    </div>
  </RevealSection>
);

/* ================================================================ HOW IT WORKS ================================================================ */
const steps = [
  { icon: <Gamepad2 size={36} color={TEAL} />, title: "Design tasks", desc: "Create gamified tasks or adapt existing ones using our builder (React + AI assistance)." },
  { icon: <ScanEye size={36} color={TEAL} />, title: "Capture signals", desc: "While patients perform tasks, we log behaviour (reaction time, accuracy) and—where enabled—MediaPipe‑based movement features (pose, hands, gait)." },
  { icon: <TrendingUp size={36} color={TEAL} />, title: "Track change over time", desc: "Summaries and trends help you see whether symptoms are stable, improving, or worsening." },
];

const HowItWorks = () => (
  <RevealSection id="how-it-works">
    <SectionHeading>How it works</SectionHeading>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
      {steps.map((s, i) => (
        <AnimatedCard key={s.title} delay={i * 150}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${TEAL}14`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              {s.icon}
            </div>
            <div style={{ fontFamily: FONT, fontSize: "0.8rem", fontWeight: 600, color: TEAL, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
              Step {i + 1}
            </div>
            <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1.1rem", marginBottom: 10, color: DARK }}>{s.title}</h3>
            <p style={{ fontFamily: FONT, fontSize: "0.93rem", color: "#555", lineHeight: 1.65, maxWidth: 320, margin: "0 auto" }}>{s.desc}</p>
          </div>
        </AnimatedCard>
      ))}
    </div>
  </RevealSection>
);

/* ================================================================ SCIENCE & TECH ================================================================ */
const SciTech = () => (
  <RevealSection id="science" bg={WARM_GRAY}>
    <SectionHeading>Science &amp; Technology</SectionHeading>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
      <AnimatedCard delay={0} style={{ background: "#fff", borderRadius: 14, padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1.1rem", marginBottom: 18, color: DARK }}>Research‑driven design</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: FONT, fontSize: "0.93rem", color: "#555", lineHeight: 1.7 }}>
          {[
            "Grounded in clinical outcome measures (reaction time, error rates, adherence).",
            "Built to support longitudinal analysis, not one‑off tests.",
            "Computer vision via MediaPipe: pre‑trained models for pose and hand tracking; we consume landmarks and motion features.",
          ].map((t) => (
            <li key={t} style={{ marginBottom: 12, paddingLeft: 20, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 2, color: TEAL, fontWeight: 700 }}>✓</span>
              {t}
            </li>
          ))}
        </ul>
      </AnimatedCard>
      <AnimatedCard delay={150} style={{ background: "#fff", borderRadius: 14, padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1.1rem", marginBottom: 18, color: DARK }}>Built with</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["React + TypeScript", "Tailwind CSS", "shadcn‑ui", "Framer Motion", "MediaPipe (Pose & Hands)", "Supabase / Postgres"].map((t) => (
            <span key={t} style={{ fontFamily: FONT, fontSize: "0.85rem", padding: "6px 14px", borderRadius: 8, background: `${TEAL}0D`, color: DARK, fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>
      </AnimatedCard>
    </div>
  </RevealSection>
);

/* ================================================================ WHAT YOU'LL SEE ================================================================ */
const tiles = [
  { icon: <LayoutDashboard size={40} color={TEAL} />, title: "Task Dashboard", caption: "Overview of current protocols and tasks." },
  { icon: <Monitor size={40} color={TEAL} />, title: "Session UI", caption: "Game‑like UI for patients, tuned for clarity and low cognitive load." },
  { icon: <BarChart3 size={40} color={TEAL} />, title: "Trend View", caption: "See how symptoms change over time with rich visualisations." },
];

const WhatYoullSee = () => (
  <RevealSection id="screenshots">
    <SectionHeading>What you'll see</SectionHeading>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
      {tiles.map((t, i) => (
        <AnimatedCard key={t.title} delay={i * 120} style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #e5e5e5", background: "#fff" }}>
          <div style={{ height: 180, background: `linear-gradient(135deg, ${TEAL}12, ${TEAL}06)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {t.icon}
          </div>
          <div style={{ padding: "20px 24px" }}>
            <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1rem", marginBottom: 6, color: DARK }}>{t.title}</h3>
            <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: "#666", lineHeight: 1.55 }}>{t.caption}</p>
          </div>
        </AnimatedCard>
      ))}
    </div>
  </RevealSection>
);

/* ================================================================ ETHICS ================================================================ */
const Ethics = () => (
  <RevealSection bg={WARM_GRAY}>
    <div style={{ maxWidth: 720, margin: "0 auto", background: "#fff", borderRadius: 14, padding: "32px 28px", border: `1px solid ${AMBER}44`, display: "flex", gap: 16, alignItems: "flex-start" }}>
      <ShieldAlert size={28} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontFamily: FONT, fontSize: "0.92rem", color: "#555", lineHeight: 1.7 }}>
        <strong style={{ color: DARK }}>Ethics &amp; disclaimer</strong><br />
        Motion.ly is <strong>not</strong> a medical device and is not approved for
        diagnosis. Any clinical use must follow ethics / IRB approval and local
        regulations (e.g.&nbsp;HIPAA, GDPR).
      </div>
    </div>
  </RevealSection>
);

/* ================================================================ FINAL CTA ================================================================ */
const FinalCta = () => {
  const { ref, visible } = useScrollReveal(0.2);
  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #0a2e2b 60%, ${TEAL} 100%)`,
        textAlign: "center", padding: "80px 24px",
      }}
    >
      <h2
        style={{
          fontFamily: FONT, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, color: "#fff", marginBottom: 28,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}
      >
        Ready to explore Motion.ly?
      </h2>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
        opacity: visible ? 1 : 0, transition: "all 0.6s ease 0.2s" }}>
        <Link
          to="/app"
          style={{
            background: TEAL, color: "#fff", fontFamily: FONT, fontWeight: 600,
            fontSize: "1.05rem", padding: "14px 40px", borderRadius: 10,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: `0 4px 20px ${TEAL}55`,
          }}
        >
          Open App <ArrowRight size={18} />
        </Link>
        <Link
          to="/feedback"
          style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff", fontFamily: FONT, fontWeight: 600,
            fontSize: "1.05rem", padding: "14px 36px", borderRadius: 10,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          Share Your Feedback
        </Link>
      </div>
    </section>
  );
};

/* ================================================================ FOOTER ================================================================ */
const Footer = () => (
  <footer
    style={{
      background: DARK,
      borderTop: "1px solid rgba(255,255,255,0.08)",
      padding: "40px 24px",
      textAlign: "center",
      fontFamily: FONT,
    }}
  >
    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
      Contact us:{" "}
      <a href="mailto:admin@motionlyai.com" style={{ color: TEAL, textDecoration: "none", fontWeight: 600 }}>
        admin@motionlyai.com
      </a>
    </p>
    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
      © {new Date().getFullYear()} Motion.ly — All rights reserved.
    </p>
  </footer>
);

/* ================================================================ PAGE ================================================================ */
const Landing = () => (
  <div style={{ fontFamily: FONT, overflowX: "hidden" }}>
    <Navbar />
    <Hero />
    <WhoItsFor />
    <HowItWorks />
    <SciTech />
    <WhatYoullSee />
    <Ethics />
    <FinalCta />
    <Footer />
  </div>
);

export default Landing;
