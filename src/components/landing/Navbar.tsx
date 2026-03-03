import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const TEAL = "#1DA39A";

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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        fontFamily: "'Poppins', sans-serif",
        background: scrolled ? "rgba(14,14,14,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo + brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src="/images/app-logo.png"
            alt="Motion.ly"
            style={{ width: 34, height: 34, borderRadius: 8 }}
          />
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: -0.5,
            }}
          >
            Motion.ly
          </span>
        </button>

        {/* Desktop links */}
        <div
          className="hidden md:flex items-center"
          style={{ gap: 28 }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.2s",
                fontFamily: "'Poppins', sans-serif",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
              }
            >
              {l.label}
            </button>
          ))}
          <Link
            to="/feedback"
            style={{
              background: "none",
              border: `1px solid ${TEAL}`,
              color: TEAL,
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "7px 18px",
              borderRadius: 8,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            Feedback
          </Link>
          <Link
            to="/app"
            style={{
              background: TEAL,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.88rem",
              padding: "8px 22px",
              borderRadius: 8,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "transform 0.15s",
            }}
          >
            Launch Demo
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(14,14,14,0.96)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { scrollTo(l.id); setOpen(false); }}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.8)",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {l.label}
            </button>
          ))}
          <Link
            to="/feedback"
            onClick={() => setOpen(false)}
            style={{
              border: `1px solid ${TEAL}`,
              color: TEAL,
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "10px 22px",
              borderRadius: 8,
              textDecoration: "none",
              textAlign: "center",
              background: "none",
            }}
          >
            Share Your Feedback
          </Link>
          <Link
            to="/app"
            onClick={() => setOpen(false)}
            style={{
              background: TEAL,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "10px 22px",
              borderRadius: 8,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Launch Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
