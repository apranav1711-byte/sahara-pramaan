# Sahara Pramaan

**Sahara Pramaan** is an independent service concept that explores a clearer, more accessible way to complete an annual certificate-support step when a fingerprint attempt fails or a pensioner needs family assistance.

> **Independent service concept — synthetic data only.** This project is not affiliated with the Government of India, UIDAI, India Post, any bank, or any pension authority. It does not connect to government, financial, biometric, messaging, or identity-verification systems.

## What works today

The application is a responsive, mobile-first service experience with a public landing page, synthetic demo login, a plain-language pensioner home, deterministic fingerprint paths, and a camera-permission-safe liveness journey. It also includes persisted mock reminder preferences, guided one-step instructions, explicit offline and session-only states, a comprehensive disclosure screen, high-contrast and large-type comfort controls, light/dark themes, a preferred-language selector for English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, and Punjabi, browser-native read-aloud controls with an immediate stop action, installable PWA assets, and a local offline shell.

| Journey | Demonstration behavior |
| --- | --- |
| Fingerprint fallback | `DEMO-FAIL` deterministically reaches the simulated fingerprint-failure screen, then offers liveness, family assistance, and mock-camp alternatives. |
| Fingerprint success | `DEMO-PASS` deterministically completes the simulated fingerprint path. |
| Family assistance | A public share link opens an assistance page with a synthetic shared-memory check; its completion updates the pensioner window through a Supabase-backed synthetic status record. |
| Liveness | The camera can be requested for a preview only. If access is denied or unavailable, the user can continue through a clearly labeled simulated path. |

## Recording-ready demo accounts

All credentials below are synthetic and exist solely for the service concept’s demo environment.

| Purpose | Pension ID | Mock OTP | Expected outcome |
| --- | --- | --- |
| Fallback recording flow | `DEMO-FAIL` | `123456` | Deterministic simulated fingerprint failure. |
| Success recording flow | `DEMO-PASS` | `123456` | Deterministic simulated fingerprint success. |
| Optional mixed path | `DEMO-MIXED` | `123456` | Controlled simulated result for exploratory testing. |

## Two-window family-assist QA procedure

Open the application in a first browser window, sign in as `DEMO-FAIL`, start verification, and choose **Ask family to help**. Copy the generated share link. Open it in a second window in the same browser profile or incognito session. The second window contains the synthetic answer directly beneath the question for recording reliability. Complete the assisted flow and keep the first pensioner window open. It polls its synthetic status every two seconds while the family state is pending, stops after completion, and should show **Submitted in this demo** within five seconds.

The user experience deliberately states that family assistance is a **synthetic assistance mechanism, not a secure identity-verification method**. It must never be represented as a production identity solution or a way to impersonate anyone.

## Synthetic data and privacy boundary

The project contains only synthetic pensioners, simulated biometric and liveness outcomes, mock OTPs, illustrative camp names and distances, fake confirmation references, and simulated reminder preferences. No real Aadhaar, PAN, payment details, accounts, biometric information, photos, location data, or messages are used or stored.

Supabase is used only for the synthetic state required for the public two-window demonstration. The application uses two whitelisted edge functions and three isolated tables:

| Resource | Purpose | Explicit limitation |
| --- | --- | --- |
| `sp_pensioner_state` | Stores the synthetic verification status and fake confirmation reference. | Never store real pensioner records or official certificate status. |
| `sp_family_assist_links` | Stores synthetic family-assist demo tokens and completion state. | Not a real authorization or identity-assurance mechanism. |
| `sp_reminder_preferences` | Stores synthetic in-app reminder preferences. | No real SMS, voice call, email, or family notification is ever sent. |

## India-first location behavior

The locator accepts a six-digit Indian PIN code for synthetic postal-area sorting and validates the input as numeric. It also offers an optional browser location permission action for a more relevant nearby experience and displays the device-reported accuracy for the current session without storing coordinates. A PIN code cannot identify an exact household location; a future DIGIPIN integration would require a separate official specification and privacy review.

## Demo reset

Open the top-right menu and choose **Reset synthetic demo**. This clears the synthetic Supabase state and local fallback state, returns the app to the landing page, and makes a fresh recording take possible. Use the reset before each video recording attempt. The menu also contains the preferred-language selector, light/dark theme control, guided-mode switch, read-aloud action, and stop-reading action.

## Local development

```bash
pnpm install
pnpm dev
```

Run the implementation checks with:

```bash
pnpm check
pnpm test
pnpm build:vercel
```

The production build emits a Vite client bundle, a committed Vercel catch-all tRPC function at `api/[...path].js`, an installable manifest, a lightweight brand icon, and a network-first service worker. The service worker never caches `/api/` responses.

## Architecture

The user interface is built with React, TypeScript, Tailwind CSS, a typed tRPC API layer, guided accessibility controls, browser-native speech/camera functions, and an installable PWA shell. Synthetic product contracts live in [`shared/mockData.ts`](./shared/mockData.ts). The local deterministic fallback is in [`server/demoStore.ts`](./server/demoStore.ts), while the Supabase-compatible server adapter is in [`server/supabasePrototype.ts`](./server/supabasePrototype.ts). The system deliberately retains a local fallback so the mock demo can remain recoverable if the public synthetic persistence layer is temporarily unavailable.

## At scale, for real

A production service would require far more than this prototype: properly audited identity assurance, meaningful consent design, privacy and security review, fraud controls, accessibility research, regulated operational partnerships, secure audit trails, and offline or voice/USSD alternatives for people without smartphones or cameras. Live camp schedules, financial status, messaging, and biometric matching must not be inferred from this prototype.

## Video production

The final demo video is intentionally deferred until the project owner supplies the screen-recording walkthrough. The planned video must use the deployed public URL, clearly state what is simulated, show the two-window family update, and remain two minutes or less.

## Release handoff

The public `main` branch is connected to Vercel production. Supabase function sources live under `supabase/functions/`, and the applied family-link schema change is recorded in `drizzle/0001_add_family_assist_attempt_limits.sql`. See [`docs/integration-status.md`](./docs/integration-status.md), [`docs/enhancement-release-2026-08-26.md`](./docs/enhancement-release-2026-08-26.md), [`docs/productization-handoff.md`](./docs/productization-handoff.md), and [`supabase/functions/README.md`](./supabase/functions/README.md) for the operational record.

## Tooling disclosure

The finished build was developed through iterative human direction with Manus, using the project environment, Supabase management integration, GitHub, and Vercel workflow. The finished service concept intentionally does not claim any real identity, pension, biometric, government, financial, location, or messaging integration.
