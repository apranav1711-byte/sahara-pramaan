import { describe, expect, it } from "vitest";
import { resolveTheme, toggleTheme } from "./themePreference";

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
});
