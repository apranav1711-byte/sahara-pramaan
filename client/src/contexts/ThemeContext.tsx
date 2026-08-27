import React, { createContext, useContext, useEffect, useState } from "react";
import { resolveInitialTheme, shouldAnimateThemeTransition, toggleTheme as getToggledTheme, type Theme } from "@/lib/themePreference";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [hasSavedPreference, setHasSavedPreference] = useState(() => {
    if (!switchable) return true;
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark";
  });
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return resolveInitialTheme(stored, window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#081819" : "#0d3434");
    if (switchable && hasSavedPreference) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable, hasSavedPreference]);

  useEffect(() => {
    if (!switchable || hasSavedPreference) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (event: MediaQueryListEvent) => setTheme(event.matches ? "dark" : "light");
    query.addEventListener("change", updateTheme);
    return () => query.removeEventListener("change", updateTheme);
  }, [switchable, hasSavedPreference]);

  const toggleTheme = switchable
      ? () => {
        const root = document.documentElement;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (shouldAnimateThemeTransition(reduceMotion)) {
          root.classList.add("theme-transitioning");
          window.setTimeout(() => root.classList.remove("theme-transitioning"), 300);
        }
        setHasSavedPreference(true);
        setTheme(getToggledTheme);
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
