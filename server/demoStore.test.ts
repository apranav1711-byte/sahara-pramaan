import { beforeEach, describe, expect, it, vi } from "vitest";
import { FAMILY_LINK_MAX_ATTEMPTS, FAMILY_LINK_TTL_MS } from "../shared/prototypeConfig";
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

  it("expires links and limits incorrect family answers", () => {
    const link = createFamilyLink("pensioner-demo-fail");
    for (let attempt = 0; attempt < FAMILY_LINK_MAX_ATTEMPTS; attempt += 1) {
      expect(() => verifyFamilyLink(link.token, "Not Sundarpur")).toThrow(
        attempt === FAMILY_LINK_MAX_ATTEMPTS - 1
          ? "This synthetic family-assist link needs a fresh attempt"
          : "That synthetic knowledge answer does not match this demo profile",
      );
    }
    expect(() => verifyFamilyLink(link.token, "Sundarpur")).toThrow(
      "This synthetic family-assist link needs a fresh attempt",
    );

    vi.useFakeTimers();
    const expiringLink = createFamilyLink("pensioner-demo-fail");
    vi.advanceTimersByTime(FAMILY_LINK_TTL_MS + 1);
    expect(() => readFamilyLink(expiringLink.token)).toThrow(
      "This synthetic family-assist link has expired or was reset",
    );
    vi.useRealTimers();
  });
});
