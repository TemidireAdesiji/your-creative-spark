import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Who it's for", id: "who-its-for" },
  { label: "How it works", id: "how-it-works" },
  { label: "Science", id: "science" },
  { label: "Preview", id: "screenshots" },
];

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + 200;
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActive(l.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <nav className="glass-strong rounded-full px-5 py-3 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer"
          >
            <div className="relative">
              <img
                src="/images/app-logo.png"
                alt="Motion.ly"
                className="w-8 h-8 rounded-lg"
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl animate-glow-pulse rounded-full" />
            </div>
            <span className="hidden sm:inline text-foreground font-bold text-base tracking-tight">
              Motion.ly
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all bg-transparent border-none cursor-pointer ${
                  active === l.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
            <Link
              to="/feedback"
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-all no-underline"
            >
              Feedback
            </Link>
            <Link
              to="/app"
              className="ml-2 inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:scale-105 transition-transform no-underline"
              style={{ boxShadow: "var(--shadow-cta)" }}
            >
              Launch Demo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors bg-transparent border-none text-foreground cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 glass-strong rounded-2xl p-5 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { scrollTo(l.id); setOpen(false); }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left bg-transparent border-none cursor-pointer transition-all ${
                    active === l.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {l.label}
                </button>
              ))}
              <Link
                to="/feedback"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-semibold text-center no-underline border border-primary text-primary"
              >
                Share Your Feedback
              </Link>
              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-semibold text-center no-underline bg-primary text-primary-foreground"
              >
                Launch Demo
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
