import { afterEach, describe, expect, it, vi } from "vitest";
import { remotePensioner } from "./supabasePrototype";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("supabasePrototype remote persistence", () => {
  it("hydrates persisted reminder preferences from the pensioner response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          profile: { id: "pensioner-demo-fail" },
          state: {
            pensioner_id: "pensioner-demo-fail",
            verification_status: "due",
            verification_method: null,
            confirmation_ref: null,
            updated_at: "2026-08-26T10:00:00.000Z",
          },
          reminder: {
            sms_enabled: false,
            voice_enabled: true,
            family_enabled: false,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await remotePensioner("pensioner-demo-fail");

    expect(result.state.reminder).toEqual({
      sms: false,
      voice: true,
      family: false,
    });
    expect(result.state.status).toBe("due");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps demo defaults when an older remote response omits reminders", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            profile: { id: "pensioner-demo-fail" },
            state: {
              pensioner_id: "pensioner-demo-fail",
              verification_status: "due",
            },
          }),
          { status: 200 },
        ),
      ),
    );

    const result = await remotePensioner("pensioner-demo-fail");

    expect(result.state.reminder).toEqual({
      sms: true,
      voice: false,
      family: true,
    });
  });
});
