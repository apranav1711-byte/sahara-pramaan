import { seededPensioners, syntheticCampDistances, syntheticCamps, type PensionerProfile } from "@shared/mockData";
import { FAMILY_LINK_MAX_ATTEMPTS, FAMILY_LINK_TTL_MS } from "../shared/prototypeConfig";

export type VerificationStatus = "due" | "in_progress" | "pending_family" | "submitted";

type PensionerState = {
  status: VerificationStatus;
  method?: "fingerprint" | "liveness" | "family";
  confirmationRef?: string;
  reminder: { sms: boolean; voice: boolean; family: boolean };
  persistence: "local";
  familyToken?: string;
  updatedAt: number;
};

type FamilyLink = {
  token: string;
  pensionerId: string;
  createdAt: number;
  attemptCount: number;
  completedAt?: number;
};

const createState = (): PensionerState => ({
  status: "due",
  reminder: { sms: true, voice: false, family: true },
  persistence: "local",
  updatedAt: Date.now(),
});

let states = new Map<string, PensionerState>();
let familyLinks = new Map<string, FamilyLink>();

function ensureState(pensionerId: string) {
  if (!states.has(pensionerId)) states.set(pensionerId, createState());
  return states.get(pensionerId)!;
}

function getProfile(pensionerId: string): PensionerProfile {
  const profile = seededPensioners.find(item => item.id === pensionerId);
  if (!profile) throw new Error("Synthetic pensioner record not found");
  return profile;
}

function reference() {
  return `SP-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function loginSynthetic(identifier: string, otp: string) {
  if (!/^\d{6}$/.test(otp)) throw new Error("Enter any six-digit synthetic OTP");
  const normalized = identifier.trim().toUpperCase();
  const profile = seededPensioners.find(item => item.pensionId === normalized || item.phone === identifier.trim()) ?? seededPensioners[0];
  return { pensionerId: profile.id, displayName: profile.name };
}

export function readPensioner(pensionerId: string) {
  const profile = getProfile(pensionerId);
  const state = ensureState(pensionerId);
  return { profile, state };
}

export function attemptFingerprint(pensionerId: string) {
  const profile = getProfile(pensionerId);
  const state = ensureState(pensionerId);
  state.status = "in_progress";
  state.updatedAt = Date.now();
  const passed = profile.fingerprintMode === "pass" || (profile.fingerprintMode === "mixed" && Date.now() % 10 >= 6);
  if (passed) {
    state.status = "submitted";
    state.method = "fingerprint";
    state.confirmationRef = reference();
  } else {
    state.status = "due";
  }
  return { passed, state };
}

export function completeLiveness(pensionerId: string) {
  const state = ensureState(pensionerId);
  state.status = "submitted";
  state.method = "liveness";
  state.confirmationRef = reference();
  state.updatedAt = Date.now();
  return { state };
}

export function createFamilyLink(pensionerId: string) {
  const profile = getProfile(pensionerId);
  const state = ensureState(pensionerId);
  const existingLink = state.familyToken ? familyLinks.get(state.familyToken) : undefined;
  if (existingLink) {
    try {
      assertActiveFamilyLink(existingLink);
      if (!existingLink.completedAt) {
        return { token: existingLink.token, code: existingLink.token.slice(-6).toUpperCase(), profile, state };
      }
    } catch {
      // Expired links are replaced with a fresh synthetic link below.
    }
  }
  state.familyToken = undefined;
  const token = `assist-${Math.random().toString(36).slice(2, 10)}`;
  familyLinks.set(token, { token, pensionerId, createdAt: Date.now(), attemptCount: 0 });
  state.status = "pending_family";
  state.familyToken = token;
  state.updatedAt = Date.now();
  return { token, code: token.slice(-6).toUpperCase(), profile, state };
}

function assertActiveFamilyLink(link: FamilyLink) {
  if (Date.now() - link.createdAt > FAMILY_LINK_TTL_MS) {
    familyLinks.delete(link.token);
    throw new Error("This synthetic family-assist link has expired or was reset");
  }
}

export function readFamilyLink(token: string) {
  const link = familyLinks.get(token);
  if (!link) throw new Error("This synthetic family-assist link has expired or was reset");
  assertActiveFamilyLink(link);
  const profile = getProfile(link.pensionerId);
  return { profile, state: ensureState(link.pensionerId), token };
}

export function verifyFamilyLink(token: string, answer: string) {
  const link = familyLinks.get(token);
  if (!link) throw new Error("This synthetic family-assist link has expired or was reset");
  assertActiveFamilyLink(link);
  if (link.completedAt) throw new Error("This synthetic family-assist link has already been completed");
  if (link.attemptCount >= FAMILY_LINK_MAX_ATTEMPTS) {
    throw new Error("This synthetic family-assist link needs a fresh attempt");
  }
  const profile = getProfile(link.pensionerId);
  if (answer.trim().toLowerCase() !== profile.family.answer.toLowerCase()) {
    link.attemptCount += 1;
    throw new Error(link.attemptCount >= FAMILY_LINK_MAX_ATTEMPTS
      ? "This synthetic family-assist link needs a fresh attempt"
      : "That synthetic knowledge answer does not match this demo profile");
  }
  const state = ensureState(link.pensionerId);
  state.status = "submitted";
  state.method = "family";
  state.confirmationRef = reference();
  state.updatedAt = Date.now();
  link.completedAt = state.updatedAt;
  return { profile, state };
}

export function updateReminder(pensionerId: string, reminder: PensionerState["reminder"]) {
  const state = ensureState(pensionerId);
  state.reminder = reminder;
  state.updatedAt = Date.now();
  return { state };
}

export function listSyntheticCamps(pincode?: string) {
  const distanceTable = syntheticCampDistances[pincode || "110001"] || syntheticCampDistances["110001"];
  return syntheticCamps
    .map(camp => ({ ...camp, distanceKm: distanceTable[camp.id] ?? camp.distanceKm }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function resetSyntheticDemo() {
  states = new Map();
  familyLinks = new Map();
  return { success: true };
}
