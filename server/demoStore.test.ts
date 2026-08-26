import { beforeEach, describe, expect, it } from "vitest";
import {
  attemptFingerprint,
  createFamilyLink,
  readFamilyLink,
  readPensioner,
  resetSyntheticDemo,
  verifyFamilyLink,
} from "./demoStore";

describe("synthetic Sahara Pramaan demo state", () => {
  beforeEach(() => resetSyntheticDemo());

  it("always fails the deterministic DEMO-FAIL fingerprint route", () => {
    const result = attemptFingerprint("pensioner-demo-fail");
    expect(result.passed).toBe(false);
    expect(readPensioner("pensioner-demo-fail").state.status).toBe("due");
  });

  it("always passes the deterministic DEMO-PASS fingerprint route", () => {
    const result = attemptFingerprint("pensioner-demo-pass");
    expect(result.passed).toBe(true);
    expect(result.state.status).toBe("submitted");
    expect(result.state.method).toBe("fingerprint");
  });

  it("updates the pensioner state after synthetic family assistance", () => {
    const link = createFamilyLink("pensioner-demo-fail");
    expect(readFamilyLink(link.token).state.status).toBe("pending_family");
    const verified = verifyFamilyLink(link.token, "Sundarpur");
    expect(verified.state.status).toBe("submitted");
    expect(verified.state.method).toBe("family");
  });
});
