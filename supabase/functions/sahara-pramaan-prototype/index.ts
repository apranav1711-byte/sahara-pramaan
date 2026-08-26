import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const profiles = {
  "pensioner-demo-fail": {
    id: "pensioner-demo-fail",
    name: "Kamala Devi",
    phone: "9000000001",
    pensionId: "DEMO-FAIL",
    preferredLanguage: "hi",
    dueDate: "31 August 2026",
    lastSubmitted: "28 August 2025",
    avatar: "KD",
    fingerprintMode: "fail",
    family: {
      name: "Ananya Sharma",
      relationship: "Daughter",
      question: "What is the name of Kamala ji’s hometown?",
      answer: "Sundarpur",
    },
  },
  "pensioner-demo-pass": {
    id: "pensioner-demo-pass",
    name: "Ramesh Prasad",
    phone: "9000000002",
    pensionId: "DEMO-PASS",
    preferredLanguage: "en",
    dueDate: "12 September 2026",
    lastSubmitted: "10 September 2025",
    avatar: "RP",
    fingerprintMode: "pass",
    family: {
      name: "Vivek Prasad",
      relationship: "Son",
      question: "What is the name of Ramesh ji’s first school?",
      answer: "Shanti Vidyalaya",
    },
  },
  "pensioner-demo-mixed": {
    id: "pensioner-demo-mixed",
    name: "Savitri Nair",
    phone: "9000000003",
    pensionId: "DEMO-MIXED",
    preferredLanguage: "en",
    dueDate: "24 September 2026",
    lastSubmitted: "21 September 2025",
    avatar: "SN",
    fingerprintMode: "mixed",
    family: {
      name: "Rohit Nair",
      relationship: "Grandson",
      question: "What is Savitri ji’s favorite flower?",
      answer: "Jasmine",
    },
  },
} as const;

type ProfileId = keyof typeof profiles;
type ReminderRow = {
  sms_enabled: boolean;
  voice_enabled: boolean;
  family_enabled: boolean;
};

const validId = (value: unknown): value is ProfileId =>
  typeof value === "string" && value in profiles;

const reference = () =>
  `SP-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;

const stateFor = async (
  supabase: ReturnType<typeof createClient>,
  pensionerId: ProfileId,
) => {
  const { data } = await supabase
    .from("sp_pensioner_state")
    .select("*")
    .eq("pensioner_id", pensionerId)
    .maybeSingle();

  if (data) return data;

  const { data: created, error } = await supabase
    .from("sp_pensioner_state")
    .insert({ pensioner_id: pensionerId })
    .select()
    .single();

  if (error) throw error;
  return created;
};

const reminderFor = async (
  supabase: ReturnType<typeof createClient>,
  pensionerId: ProfileId,
): Promise<ReminderRow | null> => {
  const { data, error } = await supabase
    .from("sp_reminder_preferences")
    .select("sms_enabled, voice_enabled, family_enabled")
    .eq("pensioner_id", pensionerId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const operation = body?.operation;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (operation === "login") {
      if (!/^\d{6}$/.test(String(body.otp || ""))) {
        return response({ error: "Enter any six-digit synthetic OTP" }, 400);
      }

      const identifier = String(body.identifier || "").trim().toUpperCase();
      const profile =
        Object.values(profiles).find(
          (item) =>
            item.pensionId === identifier ||
            item.phone === String(body.identifier || "").trim(),
        ) || profiles["pensioner-demo-fail"];

      return response({ pensionerId: profile.id, displayName: profile.name });
    }

    if (operation === "camps") {
      const pincode = String(body.pincode || "110001");
      const offsets: Record<string, Record<string, number>> = {
        "110001": { "camp-1": 0.8, "camp-2": 2.3, "camp-3": 4.1, "camp-4": 5.2, "camp-5": 6.4 },
        "110024": { "camp-4": 0.7, "camp-2": 2.8, "camp-1": 4.4, "camp-5": 4.9, "camp-3": 7.1 },
        "110075": { "camp-5": 3.1, "camp-3": 3.9, "camp-2": 5.1, "camp-1": 6.5, "camp-4": 8.2 },
      };
      const base = [
        { id: "camp-1", name: "Asha Seva Kendra", kind: "Community centre", address: "14 Lotus Lane, Sector 7", pincode: "110001", date: "28 August 2026", time: "10:00 AM – 2:00 PM" },
        { id: "camp-2", name: "Green Park Support Desk", kind: "Bank support desk", address: "22 Market Road, Green Park", pincode: "110016", date: "29 August 2026", time: "9:30 AM – 1:30 PM" },
        { id: "camp-3", name: "Nayi Disha Centre", kind: "Community centre", address: "8 Civic Square, Mayur Vihar", pincode: "110091", date: "30 August 2026", time: "11:00 AM – 3:00 PM" },
        { id: "camp-4", name: "Sunrise Postal Desk", kind: "Post office", address: "5 Lake View Road, Lajpat Nagar", pincode: "110024", date: "31 August 2026", time: "10:00 AM – 4:00 PM" },
        { id: "camp-5", name: "Sahara Samvaad Camp", kind: "Community centre", address: "19 Heritage Street, Karol Bagh", pincode: "110005", date: "2 September 2026", time: "10:30 AM – 2:30 PM" },
      ];
      const distance = offsets[pincode] || offsets["110001"];
      return response(
        base
          .map((camp) => ({ ...camp, distanceKm: distance[camp.id] || 12 }))
          .sort((a, b) => a.distanceKm - b.distanceKm),
      );
    }

    if (operation === "reset") {
      await supabase.from("sp_family_assist_links").delete().neq("token", "");
      await supabase.from("sp_reminder_preferences").delete().neq("pensioner_id", "");
      await supabase.from("sp_pensioner_state").delete().neq("pensioner_id", "");
      return response({ success: true });
    }

    if (!validId(body?.pensionerId)) {
      return response({ error: "Unknown synthetic pensioner profile" }, 400);
    }

    const profile = profiles[body.pensionerId];

    if (operation === "pensioner") {
      const [state, reminder] = await Promise.all([
        stateFor(supabase, body.pensionerId),
        reminderFor(supabase, body.pensionerId),
      ]);
      return response({ profile, state, reminder });
    }

    if (operation === "fingerprint") {
      const passed =
        profile.fingerprintMode === "pass" ||
        (profile.fingerprintMode === "mixed" && new Date().getSeconds() % 10 >= 6);
      const update = passed
        ? {
            verification_status: "submitted",
            verification_method: "fingerprint",
            confirmation_ref: reference(),
            updated_at: new Date().toISOString(),
          }
        : {
            verification_status: "due",
            verification_method: null,
            updated_at: new Date().toISOString(),
          };
      const { data, error } = await supabase
        .from("sp_pensioner_state")
        .upsert({ pensioner_id: body.pensionerId, ...update })
        .select()
        .single();
      if (error) throw error;
      return response({ passed, state: data });
    }

    if (operation === "liveness") {
      const { data, error } = await supabase
        .from("sp_pensioner_state")
        .upsert({
          pensioner_id: body.pensionerId,
          verification_status: "submitted",
          verification_method: "liveness",
          confirmation_ref: reference(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return response({ state: data });
    }

    if (operation === "create-family-link") {
      const { data: existing } = await supabase
        .from("sp_family_assist_links")
        .select("token")
        .eq("pensioner_id", body.pensionerId)
        .is("completed_at", null)
        .limit(1)
        .maybeSingle();
      const token = existing?.token || `assist-${crypto.randomUUID().slice(0, 10)}`;
      if (!existing) {
        const { error } = await supabase
          .from("sp_family_assist_links")
          .insert({ token, pensioner_id: body.pensionerId });
        if (error) throw error;
      }
      await supabase
        .from("sp_pensioner_state")
        .upsert({
          pensioner_id: body.pensionerId,
          verification_status: "pending_family",
          updated_at: new Date().toISOString(),
        });
      return response({
        token,
        code: token.slice(-6).toUpperCase(),
        profile,
        state: await stateFor(supabase, body.pensionerId),
      });
    }

    if (operation === "reminder") {
      const { data, error } = await supabase
        .from("sp_reminder_preferences")
        .upsert({
          pensioner_id: body.pensionerId,
          sms_enabled: Boolean(body.sms),
          voice_enabled: Boolean(body.voice),
          family_enabled: Boolean(body.family),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return response({ reminder: data });
    }

    return response({ error: "Unknown synthetic prototype operation" }, 400);
  } catch (error) {
    return response(
      { error: error instanceof Error ? error.message : "Synthetic prototype request failed" },
      500,
    );
  }
});
