import { describe, expect, it } from "vitest";
import { buildPresenterSteps, formatPresenterCredentials, formatPresenterSteps, presenterCopySuccess, presenterCredentialsCopySuccess } from "./presenterFlow";

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

  it("formats all synthetic quick-start credentials with an explicit safety boundary", () => {
    const english = formatPresenterCredentials("en");
    expect(english).toContain("DEMO-FAIL");
    expect(english).toContain("DEMO-PASS");
    expect(english).toContain("DEMO-MIXED");
    expect(english).toContain("Synthetic prototype only");
    expect(presenterCredentialsCopySuccess("en")).toContain("credentials copied");

    const hindi = formatPresenterCredentials("hi");
    expect(hindi).toContain("DEMO-FAIL");
    expect(hindi).toContain("कृत्रिम");
    expect(presenterCredentialsCopySuccess("hi")).toContain("कॉपी");
  });
});
