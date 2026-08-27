import { describe, expect, it } from "vitest";
import { buildPresenterSteps, formatPresenterSteps, presenterCopySuccess } from "./presenterFlow";

describe("presenter flow helpers", () => {
  it("returns four English steps with synthetic and print guidance", () => {
    const steps = buildPresenterSteps("en");
    expect(steps).toHaveLength(4);
    expect(steps.join(" ")).toContain("synthetic");
    expect(steps.join(" ")).toContain("print");
    expect(formatPresenterSteps("en").split("\n")).toHaveLength(4);
  });

  it("returns four Hindi steps and a localized success message", () => {
    const steps = buildPresenterSteps("hi");
    expect(steps).toHaveLength(4);
    expect(steps.join(" ")).toContain("कृत्रिम");
    expect(presenterCopySuccess("hi")).toContain("कॉपी");
  });
});
