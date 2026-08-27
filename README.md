# Sahara Pramaan

**Sahara Pramaan** is an independent, public synthetic prototype that explores a clearer, more accessible way to complete an annual life-certificate step when a fingerprint attempt fails or a pensioner needs family assistance.

> **Independent prototype — synthetic data only.** This project is not affiliated with the Government of India, UIDAI, India Post, any bank, or any pension authority. It does not connect to government, financial, biometric, messaging, or identity-verification systems.

## What works today

The application is a responsive, mobile-first prototype with a public landing page, synthetic login, a plain-language pensioner home, deterministic fingerprint paths, and a camera-permission-safe liveness simulation. It also includes synthetic confirmation PNG/PDF export, a paper-ready confirmation preview image, print-friendly confirmation styling, brief accessible confirmation-preparation feedback, one-tap synthetic presenter credential and walkthrough copy actions, a hideable quick-start panel, an illustrative camp locator, synthetic reminder preferences, a comprehensive disclosure screen, high-contrast and large-type comfort controls, Hindi/English switching, and browser-native read-aloud controls.

| Journey | Demonstration behavior |
| --- | --- |
| Fingerprint fallback | `DEMO-FAIL` deterministically reaches the simulated fingerprint-failure screen, then offers liveness, family assistance, and mock-camp alternatives. |
| Fingerprint success | `DEMO-PASS` deterministically completes the simulated fingerprint path. |
| Family assistance | A public share link opens an assistance page with a synthetic shared-memory check; its completion updates the pensioner window through a Supabase-backed synthetic status record. |
| Liveness | The camera can be requested for a preview only. If access is denied or unavailable, the user can continue through a clearly labeled simulated path. |

## Quick-start synthetic accounts

All credentials below are synthetic and exist solely for the prototype.

| Route | Pension ID | Mock OTP | Expected outcome |
| --- | --- | --- |
| Alternate verification route | `DEMO-FAIL` | `123456` | Deterministic simulated fingerprint failure. |
| Fingerprint success route | `DEMO-PASS` | `123456` | Deterministic simulated fingerprint success. |
| Exploratory route | `DEMO-MIXED` | `123456` | Controlled simulated result for exploratory testing. |

## Two-window family-assist QA procedure

Open the application in a first browser window, sign in as `DEMO-FAIL`, start verification, and choose **Ask family to help**. Copy the generated share link. Open it in a second window in the same browser profile or incognito session. The second window contains the synthetic answer directly beneath the question for recording reliability. Complete the assisted flow and keep the first pensioner window open. It polls its synthetic status every two seconds and should show **Submitted in this prototype** within five seconds.

The user experience deliberately states that family assistance is a **prototype assistance mechanism, not a secure identity-verification method**. It must never be represented as a production identity solution or a way to impersonate anyone.

## Synthetic data and privacy boundary

The project contains only synthetic pensioners, simulated biometric and liveness outcomes, mock OTPs, illustrative camp names and distances, fake confirmation references, and simulated reminder preferences. No real Aadhaar, PAN, payment details, accounts, biometric information, photos, location data, or messages are used or stored.

Supabase is used only for the synthetic prototype state required for the public two-window demonstration. The application uses two whitelisted edge functions and three isolated tables:

| Resource | Purpose | Explicit limitation |
| --- | --- | --- |
| `sp_pensioner_state` | Stores the synthetic verification status and fake confirmation reference. | Never store real pensioner records or official certificate status. |
| `sp_family_assist_links` | Stores synthetic family-assist demo tokens and completion state. | Not a real authorization or identity-assurance mechanism. |
| `sp_reminder_preferences` | Stores synthetic in-app reminder preferences. | No real SMS, voice call, email, or family notification is ever sent. |

## Synthetic session reset

Open the top-right menu and choose **Reset synthetic session**. This clears the synthetic Supabase state and local fallback state, returns the app to the landing page, and makes a fresh walkthrough possible. Use the reset before each recording attempt.

## Local development

```bash
pnpm install
pnpm dev
```

Run the implementation checks with:

```bash
pnpm check
pnpm test
```

## Architecture

The user interface is built with React, TypeScript, Tailwind CSS, a typed tRPC API layer, and browser-native accessibility functions. Synthetic product contracts live in [`shared/mockData.ts`](./shared/mockData.ts). The local deterministic fallback is in [`server/demoStore.ts`](./server/demoStore.ts), while the Supabase-compatible server adapter is in [`server/supabasePrototype.ts`](./server/supabasePrototype.ts). The system deliberately retains a local fallback so the mock demo can remain recoverable if the public synthetic persistence layer is temporarily unavailable.

## At scale, for real

A production service would require far more than this prototype: properly audited identity assurance, meaningful consent design, privacy and security review, fraud controls, accessibility research, regulated operational partnerships, secure audit trails, and offline or voice/USSD alternatives for people without smartphones or cameras. Live camp schedules, financial status, messaging, and biometric matching must not be inferred from this prototype.

## Video production

The final product video is intentionally deferred until the project owner supplies the screen-recording walkthrough. The planned video must use the deployed public URL, clearly state what is synthetic, show the two-window family update, and remain two minutes or less.

## Tooling disclosure

The prototype was created through iterative human direction with Manus, using the provided project environment, Supabase management integration, GitHub, and Vercel workflow. The final submission should name only the tools actually used in the finished build.
