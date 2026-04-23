"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { THEME_STORAGE_KEY } from "@/lib/portfolio-data";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

let themeSnapshot: Theme = "dark";
const themeListeners = new Set<() => void>();
let hasSyncedOnce = false;
let transitionTimeout: ReturnType<typeof setTimeout> | null = null;

function applyTheme(nextTheme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

function markTransitioning() {
  if (typeof window === "undefined") {
    return;
  }

  document.documentElement.dataset.themeTransitioning = "true";

  if (transitionTimeout !== null) {
    clearTimeout(transitionTimeout);
  }

  transitionTimeout = setTimeout(() => {
    delete document.documentElement.dataset.themeTransitioning;
    transitionTimeout = null;
  }, 520);
}

function setThemeSnapshot(nextTheme: Theme) {
  if (hasSyncedOnce && typeof window !== "undefined") {
    markTransitioning();
  }

  if (!hasSyncedOnce) {
    hasSyncedOnce = true;
  }

  themeSnapshot = nextTheme;
  applyTheme(nextTheme);
  themeListeners.forEach((listener) => listener());
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);

  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot() {
  return themeSnapshot;
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getThemeSnapshot,
    () => "dark"
  );

  useEffect(() => {
    setThemeSnapshot(getStoredTheme());
  }, []);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeSnapshot,
      toggleTheme: () =>
        setThemeSnapshot(themeSnapshot === "dark" ? "light" : "dark"),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
