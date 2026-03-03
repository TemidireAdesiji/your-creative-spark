import React from "react";
import { useScrollReveal } from "./useScrollReveal";

interface Props {
  id?: string;
  bg?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealSection({ id, bg = "transparent", children, className = "", delay = 0 }: Props) {
  const { ref, visible } = useScrollReveal(0.12);

  return (
    <section
      id={id}
      ref={ref}
      className={className}
      style={{
        background: bg,
        width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        {children}
      </div>
    </section>
  );
}
