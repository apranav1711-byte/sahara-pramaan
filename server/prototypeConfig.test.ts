import { describe, expect, it } from "vitest";
import {
  FAMILY_STATUS_POLL_MS,
  FAMILY_STATUS_VISIBLE_TARGET_MS,
  familyStatusPollingMeetsTarget,
} from "../shared/prototypeConfig";

describe("family-assist polling contract", () => {
  it("polls frequently enough to support the five-second visible-update target", () => {
    expect(FAMILY_STATUS_POLL_MS).toBe(2_000);
    expect(FAMILY_STATUS_VISIBLE_TARGET_MS).toBe(5_000);
    expect(familyStatusPollingMeetsTarget).toBe(true);
  });
});
