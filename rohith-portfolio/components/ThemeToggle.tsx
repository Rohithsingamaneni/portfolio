"use client";

import { useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isPressing, setIsPressing] = useState(false);
  const nextTheme = theme === "dark" ? "light" : "dark";

  const thumbClasses = [
    "theme-toggle__thumb",
    `theme-toggle__thumb--${theme}`,
    isPressing ? "theme-toggle__thumb--press" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "light"}
      className="theme-toggle"
      onClick={toggleTheme}
      onPointerDown={() => setIsPressing(true)}
      onPointerUp={() => setIsPressing(false)}
      onPointerLeave={() => setIsPressing(false)}
      onPointerCancel={() => setIsPressing(false)}
    >
      <span className="theme-toggle__track">
        <span className={thumbClasses}>
          <span className="theme-toggle__icon-stack" aria-hidden="true">
            <span className="theme-toggle__icon theme-toggle__icon--moon">
              <MoonStar size={16} />
            </span>
            <span className="theme-toggle__icon theme-toggle__icon--sun">
              <SunMedium size={16} />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
