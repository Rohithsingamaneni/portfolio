"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      className="theme-toggle"
      onClick={toggleTheme}
    >
      <span className="theme-toggle__track">
        <span className={`theme-toggle__thumb theme-toggle__thumb--${theme}`}>
          {theme === "dark" ? <MoonStar size={16} /> : <SunMedium size={16} />}
        </span>
      </span>
    </button>
  );
}
