export type Theme = "light" | "dark";

export function resolveTheme(value: string | null, fallback: Theme = "light"): Theme {
  return value === "dark" || value === "light" ? value : fallback;
}

export function systemTheme(prefersDark: boolean): Theme {
  return prefersDark ? "dark" : "light";
}

export function resolveInitialTheme(storedTheme: string | null, prefersDark: boolean): Theme {
  return resolveTheme(storedTheme, systemTheme(prefersDark));
}

export function shouldAnimateThemeTransition(prefersReducedMotion: boolean): boolean {
  return !prefersReducedMotion;
}

export function toggleTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}
