import { useEffect, useState } from "react";

interface SkillBarProps {
  name: string;
  level: number;
  delay: number;
}

const SkillBar = ({ name, level, delay }: SkillBarProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full glow-primary transition-all duration-[1500ms] ease-out"
          style={{
            width: visible ? `${level}%` : "0%",
            background: "var(--gradient-primary)",
          }}
        />
      </div>
    </div>
  );
};

const skills = [
  { name: "React + TypeScript", level: 95 },
  { name: "MediaPipe (Pose & Hands)", level: 88 },
  { name: "Tailwind CSS", level: 92 },
  { name: "Framer Motion", level: 85 },
  { name: "shadcn-ui", level: 90 },
  { name: "Supabase / Postgres", level: 82 },
];

export const SkillsProgress = () => {
  return (
    <div className="glass rounded-2xl p-7 h-full">
      <h3 className="text-lg font-bold mb-6 gradient-text text-center">
        Built With
      </h3>
      <div className="space-y-5">
        {skills.map((skill, i) => (
          <SkillBar key={skill.name} {...skill} delay={i * 150} />
        ))}
      </div>
    </div>
  );
};
