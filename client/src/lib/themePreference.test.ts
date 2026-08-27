import { describe, expect, it } from "vitest";
import { resolveInitialTheme, resolveTheme, shouldAnimateThemeTransition, systemTheme, toggleTheme } from "./themePreference";

describe("themePreference", () => {
  it("uses only recognized persisted theme values", () => {
    expect(resolveTheme("dark")).toBe("dark");
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("unrecognized", "dark")).toBe("dark");
  });

  it("toggles between the two supported themes", () => {
    expect(toggleTheme("light")).toBe("dark");
    expect(toggleTheme("dark")).toBe("light");
  });

  it("uses the system setting only when no explicit preference is saved", () => {
    expect(systemTheme(true)).toBe("dark");
    expect(systemTheme(false)).toBe("light");
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(null, false)).toBe("light");
    expect(resolveInitialTheme("light", true)).toBe("light");
  });

  it("suppresses the color-transition class when reduced motion is preferred", () => {
    expect(shouldAnimateThemeTransition(false)).toBe(true);
    expect(shouldAnimateThemeTransition(true)).toBe(false);
  });
});
