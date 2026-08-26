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

const reference = () =>
  `SP-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const token = String(body?.token || "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: link, error: linkError } = await supabase
      .from("sp_family_assist_links")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (linkError) throw linkError;
    if (!link || !(link.pensioner_id in profiles)) {
      return response({ error: "This synthetic family-assist link has expired or was reset" }, 404);
    }

    const profile = profiles[link.pensioner_id as keyof typeof profiles];

    if (body.operation === "read") {
      const { data: state, error } = await supabase
        .from("sp_pensioner_state")
        .select("*")
        .eq("pensioner_id", link.pensioner_id)
        .maybeSingle();
      if (error) throw error;
      return response({
        profile,
        state: state || { pensioner_id: link.pensioner_id, verification_status: "pending_family" },
        token,
      });
    }

    if (body.operation === "verify") {
      if (
        String(body.answer || "").trim().toLowerCase() !==
        profile.family.answer.toLowerCase()
      ) {
        return response(
          { error: "That synthetic knowledge answer does not match this demo profile" },
          400,
        );
      }

      const { data: state, error } = await supabase
        .from("sp_pensioner_state")
        .upsert({
          pensioner_id: link.pensioner_id,
          verification_status: "submitted",
          verification_method: "family",
          confirmation_ref: reference(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;

      const { error: completeError } = await supabase
        .from("sp_family_assist_links")
        .update({ completed_at: new Date().toISOString() })
        .eq("token", token);
      if (completeError) throw completeError;

      return response({ profile, state });
    }

    return response({ error: "Unknown family-assist prototype operation" }, 400);
  } catch (error) {
    return response(
      { error: error instanceof Error ? error.message : "Synthetic family-assist request failed" },
      500,
    );
  }
});
