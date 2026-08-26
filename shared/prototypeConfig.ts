/**
 * Shared UX contract for the synthetic family-assist demonstration.
 * The open pensioner window polls below the maximum promised visible-update time.
 */
export const FAMILY_STATUS_POLL_MS = 2_000;
export const FAMILY_STATUS_VISIBLE_TARGET_MS = 5_000;
export const FAMILY_LINK_TTL_MS = 24 * 60 * 60 * 1_000;
export const FAMILY_LINK_MAX_ATTEMPTS = 5;

export const familyStatusPollingMeetsTarget =
  FAMILY_STATUS_POLL_MS < FAMILY_STATUS_VISIBLE_TARGET_MS;
