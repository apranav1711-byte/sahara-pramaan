export type Theme = "light" | "dark";

export function resolveTheme(value: string | null, fallback: Theme = "light"): Theme {
  return value === "dark" || value === "light" ? value : fallback;
}

export function toggleTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}
