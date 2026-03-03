import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-full glass hover:bg-secondary transition-colors bg-transparent border-none cursor-pointer text-foreground"
      aria-label="Toggle theme"
    >
      <Sun
        size={18}
        className={`transition-all duration-300 ${
          theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0 absolute inset-0 m-auto"
        }`}
      />
      <Moon
        size={18}
        className={`transition-all duration-300 ${
          theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute inset-0 m-auto"
        }`}
      />
    </button>
  );
};
