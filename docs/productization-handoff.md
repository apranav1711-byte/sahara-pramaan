# Sahara Pramaan Productization Handoff

**Release:** Productized service concept · 26 August 2026

## Product definition

Sahara Pramaan is an independent, accessible certificate-support service concept. It is designed to feel calm, complete, and service-oriented while remaining fully honest that its login credentials, fingerprint result, liveness result, family answer, reminders, and confirmation exports are synthetic. The locator may fetch transient nearby Google Places through the server-side Maps proxy, while synthetic fallback locations remain clearly labeled.

The product does not connect to government, UIDAI, India Post, banks, pension authorities, biometric providers, messaging providers, or real identity systems. It does not persist device coordinates or live Places results. The synthetic boundary is a product requirement, not a temporary error state.

## What is complete

| Surface | Finished behavior |
| --- | --- |
| Landing and onboarding | Clear service positioning, synthetic-data disclosure, demo-account chooser, and calm primary action. |
| Pensioner journey | Synthetic login, plain-language due status, fingerprint pass/fail routes, liveness fallback, family assistance, camp locator, confirmation, reminders, and reset. |
| Family assistance | Shareable synthetic link, second-window flow, contextual guided instruction, polling only while pending, 24-hour expiry, five-attempt limit, and explicit non-impersonation language. |
| Accessibility | Large-type mode, high contrast, fully rendered locale strings for English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, and Punjabi, browser-native read-aloud with immediate stop, context-aware guided instructions, repeat-instruction control, semantic status regions, keyboard-friendly controls, and zoom-friendly viewport configuration. |
| Resilience | Supabase-backed synthetic state, deterministic local fallback, session-only persistence banner, offline browser state banner, reset cleanup, and network-first service-worker shell. |
| Installability | Web manifest, lightweight brand icon, standalone display metadata, and service-worker registration in production. |
| Performance | React and UI vendor chunks are separated from the application bundle. The family polling interval stops once the state is submitted. The primary confirmation journey keeps the lighter PDF and share actions and no longer offers image export. |
| QA | Type checking, Vitest unit coverage, production smoke testing, direct Supabase smoke testing, manual browser verification of landing, login, status, fallback, family-link, Kannada, Bengali, and the ten-locale critical-path rendering. |

## Repository map

| Location | Responsibility |
| --- | --- |
| `client/src/pages/Home.tsx` | Main service experience and screen-state orchestration. |
| `client/src/main.tsx` | React, tRPC, query-client, and service-worker bootstrap. |
| `client/src/index.css` | Design tokens, accessibility modes, motion preferences, and shared visual utilities. |
| `client/public/manifest.webmanifest` | Install metadata. |
| `client/public/sw.js` | Network-first shell cache that excludes `/api/` responses. |
| `client/public/icon.svg` | Installable service mark. |
| `server/routers.ts` | Typed tRPC procedure contract. |
| `server/demoStore.ts` | Deterministic local fallback state and family-link safety rules. |
| `server/supabasePrototype.ts` | Remote adapter with safe local fallback and persistence-source metadata. |
| `supabase/functions/sahara-pramaan-prototype/index.ts` | Supabase synthetic login, status, reminder, camp, family-link creation, and reset operations. |
| `supabase/functions/sahara-pramaan-family-assist/index.ts` | Supabase synthetic family-link read and answer verification. |
| `drizzle/0001_add_family_assist_attempt_limits.sql` | Source-controlled family-link attempt-limit schema change. |
| `scripts/production-smoke.mjs` | Repeatable production asset/API/persistence/reset smoke test. |
| `api/[...path].js` | Committed Vercel tRPC catch-all bundle targeted by `vercel.json`. |

## Local setup

```bash
pnpm install
pnpm dev
```

The development server runs the Vite client and the local server adapter. The local fallback store is deterministic and synthetic. It is not intended to be used as production storage. The language selector stores the user’s preferred Indian language locally, and the primary shell, onboarding, login, status, accessibility, and locator journeys render locale-specific copy for all ten supported languages. The UI no longer uses an interval-based DOM text walker.

## Verification commands

```bash
pnpm check
pnpm test
pnpm build:vercel
pnpm test:production
```

`pnpm test:production` defaults to `https://sahara-pramaan.vercel.app`. To check another deployment, use:

```bash
SMOKE_BASE_URL=https://your-deployment.vercel.app pnpm test:production
```

The production smoke suite checks the manifest, service worker, synthetic login, camp list, the live-or-synthetic support-location contract, family-link creation, reminder write/readback, and synthetic reset cleanup.

## Authentication and messaging decision

The current app keeps the deterministic synthetic login so the hackathon journey is reliable without collecting real personal data. Google Sign-In can be added as a real account layer only after a Google Web OAuth client is created, authorized origins and redirect behavior are configured, ID tokens are validated server-side, and privacy/consent copy is approved. WhatsApp OTP is not a simple client-side feature: it requires a Meta WhatsApp Business Platform setup, a verified sender, approved localized authentication templates, opt-in, secure server credentials, delivery handling, rate limits, and a reset/recovery path. No provider credentials are configured in this project, so neither live Google nor WhatsApp authentication is fabricated.

## Supabase operating procedure

The live project contains the following isolated synthetic tables:

| Table | Purpose |
| --- | --- |
| `sp_pensioner_state` | Synthetic verification status, method, fake confirmation reference, and timestamps. |
| `sp_family_assist_links` | Synthetic family-link tokens, completion state, creation time, attempt count, and last attempt time. |
| `sp_reminder_preferences` | Synthetic in-app reminder flags only. |

The two functions intentionally use `verify_jwt: false` so a public recording can open a family-assist link in a second window. That setting is safe only because the data and operations are synthetic. Family links expire after 24 hours, and incorrect answers are limited to five attempts. A future real service must replace this with audited authorization, signed expiring links, consent, rate limiting, abuse monitoring, and a formal identity-assurance architecture.

After changing a function, deploy the exact source under `supabase/functions/`, run the direct function smoke test, run `pnpm test:production`, and update [`docs/integration-status.md`](./integration-status.md). Never deploy source from an unreviewed temporary file.

## Vercel operating procedure

GitHub `main` is connected to the Vercel project `sahara-pramaan`. The build command is:

```bash
pnpm build:vercel
```

The command builds the Vite client and overwrites the committed `api/[...path].js` tRPC catch-all bundle. This output path must remain aligned with the rewrite in `vercel.json`; otherwise Vercel can successfully build while serving an older committed server bundle.

The public alias is [sahara-pramaan.vercel.app](https://sahara-pramaan.vercel.app). After every production push, verify the deployment is Ready and run the smoke command against the public alias. The locator accepts a six-digit Indian PIN code, uses the server-side Google Maps proxy for geocoding and nearby support-oriented Places search when available, and offers optional browser geolocation consent. It displays live map markers and Google Maps links only for live results; otherwise it labels synthetic fallback locations. It must never claim a PIN code is an exact household location.

## Recording and acceptance checklist

Use `DEMO-FAIL` with mock OTP `123456` for the primary journey. Confirm that the fingerprint fallback shows liveness, family assistance, and illustrative support-location alternatives. Create a family link and open it in a second window. Verify that the pensioner window updates after the family answer is completed. Visit reminders and confirm that saved mock settings remain after a fresh pensioner read. Test Kannada, Bengali, Hindi, and the other supported locales, guided instructions, read-aloud and stop-reading, large type, high contrast, zoom, the live-or-synthetic map state, and the camera-denied liveness route. Complete one confirmation PDF export and share action, then run reset.

The final screen recording must say that the service is independent and synthetic, must not imply an official certificate or live status, and must not show real personal information. The two-window family-assist flow must be described as assistance, not identity verification.

## Support and incident handling

If the public app is unavailable, first check the latest Vercel deployment state and build logs. If the UI loads but state operations fail, check the Supabase function status and the service-function source versions. If the remote layer is unavailable, the UI should identify session-only mode and remain usable for a local synthetic demonstration. Reset the synthetic state after any investigation that mutates demo records.

If a future change touches identity, biometrics, payment status, government records, messaging, location tracking, or real-person data, stop feature work and create a separate architecture and compliance review. Do not evolve the synthetic functions incrementally into a production identity system.

## Release record

| Checkpoint | Commit or evidence |
| --- | --- |
| Remote reminder persistence | `81aba6e` |
| Vercel bundle-path repair | `597fc49` |
| Productization checkpoint | `f7a9d10` |
| Guided family polish | `c64057e` |
| Final integration handoff | `810f6ee` |
| Latest production deployment | Vercel READY deployment `dpl_6zCsSe15RwAy9AVFXZKszdJrTjBU` from `f33f250` |
| Local validation | `pnpm check`, `pnpm test` — 7 files / 16 tests passed; `pnpm build:vercel` passed. |
| Production validation | `pnpm test:production` passed with manifest, service worker, login, camps, live-or-synthetic support locations, family link, reminder readback, and reset checks; current provider response was clearly labeled `synthetic`. |
