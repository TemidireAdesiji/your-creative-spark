import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Stethoscope, FlaskConical, Gamepad2, ScanEye, TrendingUp,
  Users, ShieldAlert, ArrowRight, ChevronDown,
  LayoutDashboard, Monitor, BarChart3,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { ParallaxBackground } from "@/components/landing/ParallaxBackground";
import { SkillsProgress } from "@/components/landing/SkillsProgress";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { FloatingParticles } from "@/components/landing/FloatingParticles";

/* ================================================================ HERO ================================================================ */
const Hero = () => {
  const fullText = "Track neurodegenerative symptoms through research-grade, gamified tasks.";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 max-w-3xl text-center">
        <ScrollReveal>
          <img
            src="/images/app-logo.png"
            alt="Motion.ly logo"
            className="w-20 h-20 rounded-2xl mx-auto mb-8 pulse-glow"
          />
        </ScrollReveal>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight gradient-text mb-6 pb-1">
          {typed}
          <span className="animate-blink text-primary">|</span>
        </h1>

        <ScrollReveal delay={200}>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            Motion.ly helps clinicians and researchers measure changes in movement
            and cognition using AI-assisted tasks and computer-vision signals
            (e.g.&nbsp;MediaPipe pose and hand tracking).
          </p>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:scale-105 transition-transform no-underline glow-primary"
              style={{ boxShadow: "var(--shadow-cta)" }}
            >
              Launch Demo <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-8 py-4 glass rounded-full font-medium text-base text-foreground bg-transparent border-none cursor-pointer hover:bg-secondary transition-all"
            >
              See how it works <ChevronDown size={18} />
            </button>
          </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <div className="mt-16">
          <button
            onClick={() => document.getElementById("who-its-for")?.scrollIntoView({ behavior: "smooth" })}
            className="glass p-3 rounded-full animate-float bg-transparent border-none cursor-pointer inline-flex"
          >
            <ChevronDown className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

/* ================================================================ WHO IT'S FOR ================================================================ */
const personas = [
  {
    icon: <Stethoscope size={28} />,
    title: "Clinicians",
    desc: "Monitor progression of Parkinson's, ALS, and more with repeatable tasks instead of subjective notes.",
    backDesc: "Replace subjective clinical notes with objective, repeatable digital tasks that track motor and cognitive changes over time.",
    tags: ["Parkinson's", "ALS", "Motor tracking"],
    color: "text-primary",
    border: "border-primary/30",
  },
  {
    icon: <FlaskConical size={28} />,
    title: "Researchers",
    desc: <>Run longitudinal studies with digital tasks and standardized metrics.<br className="hidden sm:block" /><span className="block mt-1">No expensive lab equipment needed.</span></>,
    backDesc: "Design and deploy longitudinal studies using standardized digital tasks. Collect consistent, comparable data across sites without specialised hardware.",
    tags: ["Longitudinal", "Standardised", "Multi-site"],
    color: "text-accent",
    border: "border-accent/30",
  },
  {
    icon: <Users size={28} />,
    title: "Patients & Participants",
    desc: "Play simple games that translate into useful movement and cognitive data, at home or in clinic.",
    backDesc: "Engage with fun, accessible games designed for all ability levels. Your gameplay generates meaningful health data for your care team.",
    tags: ["Accessible", "Home-based", "Gamified"],
    color: "text-primary",
    border: "border-primary/30",
  },
];

const FlipCard = ({ persona, index }: { persona: typeof personas[0]; index: number }) => (
  <ScrollReveal delay={index * 120}>
    <div className="group h-72 [perspective:1000px] isolate relative z-0 hover:z-10">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className={`absolute inset-0 glass rounded-2xl p-7 border-t-2 ${persona.border} [backface-visibility:hidden] flex flex-col`}>
          <div className={`mb-4 ${persona.color}`}>{persona.icon}</div>
          <h3 className="text-lg font-bold text-foreground mb-2">{persona.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{persona.desc}</p>
        </div>
        {/* Back */}
        <div className={`absolute inset-0 glass rounded-2xl p-7 border-t-2 ${persona.border} [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between`}>
          <div>
            <h3 className="text-lg font-bold gradient-text mb-3">{persona.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{persona.backDesc}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {persona.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

const WhoItsFor = () => (
  <section id="who-its-for" className="relative py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">Who it's for</h2>
        <div className="divider-glow max-w-xs mx-auto mb-12" />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personas.map((p, i) => (
          <FlipCard key={p.title} persona={p} index={i} />
        ))}
      </div>
    </div>
    <div className="divider-glow max-w-5xl mx-auto mt-24" />
  </section>
);

/* ================================================================ HOW IT WORKS ================================================================ */
const steps = [
  { icon: <Gamepad2 size={32} className="text-primary" />, title: "Design tasks", desc: "Create gamified tasks or adapt existing ones using our builder (React + AI assistance)." },
  { icon: <ScanEye size={32} className="text-primary" />, title: "Capture signals", desc: "While patients perform tasks, we log behaviour (reaction time, accuracy) and, where enabled, MediaPipe-based movement features (pose, hands, gait)." },
  { icon: <TrendingUp size={32} className="text-primary" />, title: "Track change over time", desc: "Summaries and trends help you see whether symptoms are stable, improving, or worsening." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">How it works</h2>
        <div className="divider-glow max-w-xs mx-auto mb-12" />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 150}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full glass inline-flex items-center justify-center mb-5 pulse-glow">
                {s.icon}
              </div>
              <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                Step {i + 1}
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
    <div className="divider-glow max-w-5xl mx-auto mt-24" />
  </section>
);

/* ================================================================ SCIENCE & TECH ================================================================ */
const SciTech = () => (
  <section id="science" className="relative py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">Science &amp; Technology</h2>
        <div className="divider-glow max-w-xs mx-auto mb-12" />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScrollReveal delay={0}>
          <div className="glass rounded-2xl p-7 hover-lift h-full">
            <h3 className="text-lg font-bold text-foreground mb-5">Research-driven design</h3>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed list-none p-0">
              {[
                "Grounded in clinical outcome measures (reaction time, error rates, adherence).",
                "Built to support longitudinal analysis, not one-off tests.",
                "Computer vision via MediaPipe: pre-trained models for pose and hand tracking; we consume landmarks and motion features.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <SkillsProgress />
        </ScrollReveal>
      </div>
    </div>
    <div className="divider-glow max-w-5xl mx-auto mt-24" />
  </section>
);

/* ================================================================ WHAT YOU'LL SEE ================================================================ */
const tiles = [
  { icon: <LayoutDashboard size={36} className="text-primary" />, title: "Task Dashboard", caption: "Overview of current protocols and tasks." },
  { icon: <Monitor size={36} className="text-primary" />, title: "Session UI", caption: "Game-like UI for patients, tuned for clarity and low cognitive load." },
  { icon: <BarChart3 size={36} className="text-primary" />, title: "Trend View", caption: "See how symptoms change over time with rich visualisations." },
];

const WhatYoullSee = () => (
  <section id="screenshots" className="relative py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">What you'll see</h2>
        <div className="divider-glow max-w-xs mx-auto mb-12" />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((t, i) => (
          <ScrollReveal key={t.title} delay={i * 120}>
            <div className="glass rounded-2xl overflow-hidden hover-lift">
              <div className="h-44 flex items-center justify-center bg-primary/5">
                {t.icon}
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-foreground mb-1">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.caption}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
    <div className="divider-glow max-w-5xl mx-auto mt-24" />
  </section>
);

/* ================================================================ ETHICS ================================================================ */
const Ethics = () => (
  <section className="relative py-16 px-6">
    <div className="max-w-3xl mx-auto">
      <ScrollReveal>
        <div className="glass rounded-2xl p-7 flex gap-4 items-start border-l-2" style={{ borderColor: "hsl(42 84% 50% / 0.5)" }}>
          <ShieldAlert size={26} className="shrink-0 mt-0.5" style={{ color: "hsl(42 84% 50%)" }} />
          <div className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Ethics &amp; disclaimer</strong><br />
            Motion.ly is <strong>not</strong> a medical device and is not approved for
            diagnosis. Any clinical use must follow ethics / IRB approval and local
            regulations (e.g.&nbsp;HIPAA, GDPR).
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ================================================================ FINAL CTA ================================================================ */
const FinalCta = () => (
  <section className="relative py-24 px-6">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />

    <div className="relative z-10 text-center">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 gradient-text">
          Ready to explore Motion.ly?
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:scale-105 transition-transform no-underline glow-primary"
            style={{ boxShadow: "var(--shadow-cta)" }}
          >
            Open App <ArrowRight size={18} />
          </Link>
          <Link
            to="/feedback"
            className="inline-flex items-center gap-2 px-8 py-4 glass rounded-full font-semibold text-base text-foreground no-underline hover:bg-secondary transition-all"
          >
            Share Your Feedback
          </Link>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ================================================================ FOOTER ================================================================ */
const Footer = () => (
  <footer className="border-t border-border py-10 px-6 text-center">
    <p className="text-sm text-muted-foreground mb-2">
      Contact us:{" "}
      <a href="mailto:admin@motionlyai.com" className="text-primary font-semibold no-underline hover:underline">
        admin@motionlyai.com
      </a>
    </p>
    <p className="text-xs text-muted-foreground/50">
      © {new Date().getFullYear()} Motion.ly. All rights reserved.
    </p>
  </footer>
);

/* ================================================================ PAGE ================================================================ */
const Landing = () => (
  <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-poppins">
    <ScrollProgress />
    <ParallaxBackground />
    <FloatingParticles />
    <Navbar />
    <main className="relative z-10">
      <Hero />
      <WhoItsFor />
      <HowItWorks />
      <SciTech />
      <WhatYoullSee />
      <Ethics />
      <FinalCta />
    </main>
    <Footer />
  </div>
);

export default Landing;
