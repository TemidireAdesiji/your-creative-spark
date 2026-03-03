import { Link } from "react-router-dom";
import {
  Stethoscope,
  FlaskConical,
  Gamepad2,
  ScanEye,
  TrendingUp,
  Users,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Monitor,
  BarChart3,
} from "lucide-react";

const TEAL = "#1DA39A";
const DARK = "#0E0E0E";
const WARM_GRAY = "#F5F3F0";
const AMBER = "#E6A817";
const PURPLE = "#7C5CBF";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/* ─── Section wrapper ─── */
const Section = ({
  id,
  children,
  bg = "transparent",
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  bg?: string;
  className?: string;
}) => (
  <section
    id={id}
    className={className}
    style={{ background: bg, width: "100%" }}
  >
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
      {children}
    </div>
  </section>
);

/* ─── Heading helper ─── */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: "'Fraunces', serif",
      fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
      fontWeight: 700,
      color: DARK,
      marginBottom: 48,
      textAlign: "center",
    }}
  >
    {children}
  </h2>
);

/* ================================================================
   1. HERO
   ================================================================ */
const Hero = () => (
  <section
    style={{
      background: `linear-gradient(160deg, ${DARK} 0%, #0a2e2b 50%, ${TEAL} 100%)`,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "60px 24px",
    }}
  >
    <div style={{ maxWidth: 760 }}>
      <img
        src="/images/app-logo.png"
        alt="MotionLy logo"
        style={{
          width: 80,
          height: 80,
          borderRadius: 18,
          marginBottom: 32,
          boxShadow: `0 0 40px ${TEAL}66`,
        }}
      />
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          fontWeight: 800,
          lineHeight: 1.15,
          color: "#fff",
          marginBottom: 24,
        }}
      >
        Track neurodegenerative symptoms through research‑grade, gamified tasks.
      </h1>
      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(1rem, 2vw, 1.15rem)",
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1.7,
          maxWidth: 620,
          margin: "0 auto 40px",
        }}
      >
        Motion.ly helps clinicians and researchers measure changes in movement
        and cognition using AI‑assisted tasks and computer‑vision signals
        (e.g.&nbsp;MediaPipe pose and hand tracking).
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/app"
          style={{
            background: TEAL,
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "1.05rem",
            padding: "14px 36px",
            borderRadius: 10,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: `0 4px 20px ${TEAL}55`,
            transition: "transform .15s",
          }}
        >
          Launch Demo <ArrowRight size={18} />
        </Link>
        <button
          onClick={() => scrollTo("how-it-works")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: "1.05rem",
            padding: "14px 32px",
            borderRadius: 10,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          See how it works <ChevronDown size={18} />
        </button>
      </div>
    </div>
  </section>
);

/* ================================================================
   2. WHO IT'S FOR
   ================================================================ */
const personas = [
  {
    icon: <Stethoscope size={32} color={TEAL} />,
    title: "Clinicians",
    desc: "Monitor progression of Parkinson's, ALS, and more with repeatable tasks instead of subjective notes.",
    accent: TEAL,
  },
  {
    icon: <FlaskConical size={32} color={AMBER} />,
    title: "Researchers",
    desc: "Run longitudinal studies with digital tasks and standardized metrics—no expensive lab equipment needed.",
    accent: AMBER,
  },
  {
    icon: <Users size={32} color={PURPLE} />,
    title: "Patients & Participants",
    desc: "Play simple games that translate into useful movement and cognitive data—at home or in clinic.",
    accent: PURPLE,
  },
];

const WhoItsFor = () => (
  <Section id="who-its-for" bg={WARM_GRAY}>
    <SectionHeading>Who it's for</SectionHeading>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 28,
      }}
    >
      {personas.map((p) => (
        <div
          key={p.title}
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "36px 28px",
            borderTop: `4px solid ${p.accent}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ marginBottom: 16 }}>{p.icon}</div>
          <h3
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "1.15rem",
              marginBottom: 10,
              color: DARK,
            }}
          >
            {p.title}
          </h3>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.6,
            }}
          >
            {p.desc}
          </p>
        </div>
      ))}
    </div>
  </Section>
);

/* ================================================================
   3. HOW IT WORKS
   ================================================================ */
const steps = [
  {
    icon: <Gamepad2 size={36} color={TEAL} />,
    title: "Design tasks",
    desc: "Create gamified tasks or adapt existing ones using our builder (React + AI assistance).",
  },
  {
    icon: <ScanEye size={36} color={TEAL} />,
    title: "Capture signals",
    desc: "While patients perform tasks, we log behaviour (reaction time, accuracy) and—where enabled—MediaPipe‑based movement features (pose, hands, gait).",
  },
  {
    icon: <TrendingUp size={36} color={TEAL} />,
    title: "Track change over time",
    desc: "Summaries and trends help you see whether symptoms are stable, improving, or worsening.",
  },
];

const HowItWorks = () => (
  <Section id="how-it-works">
    <SectionHeading>How it works</SectionHeading>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 40,
        position: "relative",
      }}
    >
      {steps.map((s, i) => (
        <div key={s.title} style={{ textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `${TEAL}14`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {s.icon}
          </div>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: TEAL,
              marginBottom: 8,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Step {i + 1}
          </div>
          <h3
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              marginBottom: 10,
              color: DARK,
            }}
          >
            {s.title}
          </h3>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.93rem",
              color: "#555",
              lineHeight: 1.65,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            {s.desc}
          </p>
        </div>
      ))}
    </div>
  </Section>
);

/* ================================================================
   4. SCIENCE & TECHNOLOGY
   ================================================================ */
const SciTech = () => (
  <Section id="science" bg={WARM_GRAY}>
    <SectionHeading>Science &amp; Technology</SectionHeading>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 32,
      }}
    >
      {/* Science */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "32px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <h3
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            marginBottom: 18,
            color: DARK,
          }}
        >
          Research‑driven design
        </h3>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.93rem",
            color: "#555",
            lineHeight: 1.7,
          }}
        >
          {[
            "Grounded in clinical outcome measures (reaction time, error rates, adherence).",
            "Built to support longitudinal analysis, not one‑off tests.",
            "Computer vision via MediaPipe: pre‑trained models for pose and hand tracking; we consume landmarks and motion features.",
          ].map((t) => (
            <li key={t} style={{ marginBottom: 12, paddingLeft: 20, position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 2,
                  color: TEAL,
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Tech */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "32px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <h3
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            marginBottom: 18,
            color: DARK,
          }}
        >
          Built with
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            "React + TypeScript",
            "Tailwind CSS",
            "shadcn‑ui",
            "Framer Motion",
            "MediaPipe (Pose & Hands)",
            "Supabase / Postgres",
          ].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.85rem",
                padding: "6px 14px",
                borderRadius: 8,
                background: `${TEAL}0D`,
                color: DARK,
                fontWeight: 500,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

/* ================================================================
   5. WHAT YOU'LL SEE (placeholder tiles)
   ================================================================ */
const tiles = [
  {
    icon: <LayoutDashboard size={40} color={TEAL} />,
    title: "Task Dashboard",
    caption: "Overview of current protocols and tasks.",
  },
  {
    icon: <Monitor size={40} color={TEAL} />,
    title: "Session UI",
    caption: "Game‑like UI for patients, tuned for clarity and low cognitive load.",
  },
  {
    icon: <BarChart3 size={40} color={TEAL} />,
    title: "Trend View",
    caption: "See how symptoms change over time with rich visualisations.",
  },
];

const WhatYoullSee = () => (
  <Section id="screenshots">
    <SectionHeading>What you'll see</SectionHeading>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 28,
      }}
    >
      {tiles.map((t) => (
        <div
          key={t.title}
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #e5e5e5",
            background: "#fff",
          }}
        >
          <div
            style={{
              height: 180,
              background: `linear-gradient(135deg, ${TEAL}12, ${TEAL}06)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t.icon}
          </div>
          <div style={{ padding: "20px 24px" }}>
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: 6,
                color: DARK,
              }}
            >
              {t.title}
            </h3>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.9rem",
                color: "#666",
                lineHeight: 1.55,
              }}
            >
              {t.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/* ================================================================
   6. ETHICS & DISCLAIMER
   ================================================================ */
const Ethics = () => (
  <Section bg={WARM_GRAY}>
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 14,
        padding: "32px 28px",
        border: `1px solid ${AMBER}44`,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <ShieldAlert size={28} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.92rem",
          color: "#555",
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: DARK }}>Ethics &amp; disclaimer</strong>
        <br />
        MotionLy is <strong>not</strong> a medical device and is not approved for
        diagnosis. Any clinical use must follow ethics / IRB approval and local
        regulations (e.g.&nbsp;HIPAA, GDPR).
      </div>
    </div>
  </Section>
);

/* ================================================================
   7. FINAL CTA
   ================================================================ */
const FinalCta = () => (
  <section
    style={{
      background: `linear-gradient(160deg, ${DARK} 0%, #0a2e2b 60%, ${TEAL} 100%)`,
      textAlign: "center",
      padding: "80px 24px",
    }}
  >
    <h2
      style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
        fontWeight: 700,
        color: "#fff",
        marginBottom: 28,
      }}
    >
      Ready to explore MotionLy?
    </h2>
    <Link
      to="/app"
      style={{
        background: TEAL,
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
        fontSize: "1.05rem",
        padding: "14px 40px",
        borderRadius: 10,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: `0 4px 20px ${TEAL}55`,
      }}
    >
      Open App <ArrowRight size={18} />
    </Link>
  </section>
);

/* ================================================================
   PAGE
   ================================================================ */
const Landing = () => (
  <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: "hidden" }}>
    <Hero />
    <WhoItsFor />
    <HowItWorks />
    <SciTech />
    <WhatYoullSee />
    <Ethics />
    <FinalCta />
  </div>
);

export default Landing;
