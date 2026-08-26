import {
  attemptFingerprint as localFingerprint,
  completeLiveness as localLiveness,
  createFamilyLink as localCreateFamilyLink,
  loginSynthetic as localLogin,
  readFamilyLink as localReadFamilyLink,
  readPensioner as localReadPensioner,
  resetSyntheticDemo as localReset,
  updateReminder as localReminder,
  verifyFamilyLink as localVerifyFamily,
} from "./demoStore";

const PROJECT_URL = "https://ehwwpesbwvohrazllutu.supabase.co/functions/v1";
const prototypeEndpoint = `${PROJECT_URL}/sahara-pramaan-prototype`;
const familyEndpoint = `${PROJECT_URL}/sahara-pramaan-family-assist`;

type RemoteState = {
  pensioner_id: string;
  verification_status: "due" | "in_progress" | "pending_family" | "submitted";
  verification_method?: "fingerprint" | "liveness" | "family" | null;
  confirmation_ref?: string | null;
  updated_at?: string;
};

type RemoteReminder = {
  sms_enabled: boolean;
  voice_enabled: boolean;
  family_enabled: boolean;
};

function normalizeState(state: RemoteState, reminder?: RemoteReminder | null) {
  return {
    status: state.verification_status,
    method: state.verification_method ?? undefined,
    confirmationRef: state.confirmation_ref ?? undefined,
    reminder: {
      sms: typeof reminder?.sms_enabled === "boolean" ? reminder.sms_enabled : true,
      voice: typeof reminder?.voice_enabled === "boolean" ? reminder.voice_enabled : false,
      family: typeof reminder?.family_enabled === "boolean" ? reminder.family_enabled : true,
    },
    updatedAt: state.updated_at ? new Date(state.updated_at).getTime() : Date.now(),
  };
}

async function request<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) throw new Error(payload.error || "Synthetic persistence request failed");
  return payload as T;
}

export async function remoteLogin(identifier: string, otp: string) {
  try { return await request<{ pensionerId: string; displayName: string }>(prototypeEndpoint, { operation: "login", identifier, otp }); }
  catch { return localLogin(identifier, otp); }
}

export async function remotePensioner(pensionerId: string) {
  try {
    const payload = await request<{
      profile: ReturnType<typeof localReadPensioner>["profile"];
      state: RemoteState;
      reminder?: RemoteReminder | null;
    }>(prototypeEndpoint, { operation: "pensioner", pensionerId });
    return { profile: payload.profile, state: normalizeState(payload.state, payload.reminder) };
  } catch { return localReadPensioner(pensionerId); }
}

export async function remoteFingerprint(pensionerId: string) {
  try {
    const payload = await request<{ passed: boolean; state: RemoteState }>(prototypeEndpoint, { operation: "fingerprint", pensionerId });
    return { passed: payload.passed, state: normalizeState(payload.state) };
  } catch { return localFingerprint(pensionerId); }
}

export async function remoteLiveness(pensionerId: string) {
  try {
    const payload = await request<{ state: RemoteState }>(prototypeEndpoint, { operation: "liveness", pensionerId });
    return { state: normalizeState(payload.state) };
  } catch { return localLiveness(pensionerId); }
}

export async function remoteCreateFamilyLink(pensionerId: string) {
  try {
    const payload = await request<{ token: string; code: string; profile: ReturnType<typeof localReadPensioner>["profile"]; state: RemoteState }>(prototypeEndpoint, { operation: "create-family-link", pensionerId });
    return { ...payload, state: normalizeState(payload.state) };
  } catch { return localCreateFamilyLink(pensionerId); }
}

export async function remoteFamilyLink(token: string) {
  try {
    const payload = await request<{ token: string; profile: ReturnType<typeof localReadPensioner>["profile"]; state: RemoteState }>(familyEndpoint, { operation: "read", token });
    return { ...payload, state: normalizeState(payload.state) };
  } catch { return localReadFamilyLink(token); }
}

export async function remoteVerifyFamily(token: string, answer: string) {
  try {
    const payload = await request<{ profile: ReturnType<typeof localReadPensioner>["profile"]; state: RemoteState }>(familyEndpoint, { operation: "verify", token, answer });
    return { ...payload, state: normalizeState(payload.state) };
  } catch { return localVerifyFamily(token, answer); }
}

export async function remoteReminder(pensionerId: string, reminder: { sms: boolean; voice: boolean; family: boolean }) {
  try {
    await request(prototypeEndpoint, { operation: "reminder", pensionerId, ...reminder });
    return localReminder(pensionerId, reminder);
  } catch { return localReminder(pensionerId, reminder); }
}

export async function remoteReset() {
  try { await request(prototypeEndpoint, { operation: "reset" }); }
  catch { /* The local reset still makes the recording flow recoverable if remote access is temporarily unavailable. */ }
  return localReset();
}
