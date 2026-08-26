# Enhancement Release QA — 26 August 2026 (Historical Checkpoint)

> **Historical note:** This document records an earlier build. For the current scope, use [`judge-submission.md`](./judge-submission.md), [`productization-handoff.md`](./productization-handoff.md), and [`integration-status.md`](./integration-status.md). The current release retains PDF/share confirmation actions, uses explicit ten-language locale rendering, and includes a live-or-synthetic Google Maps locator.

## Scope

This release adds only **synthetic prototype** convenience features. It does not add a real certificate, identity, biometric, pension, payment, messaging, or government-system integration.

| Enhancement | Production verification | Result |
| --- | --- | --- |
| Recording mode | Public landing page exposed `DEMO-FAIL`, `DEMO-PASS`, and `DEMO-MIXED`, each with mock OTP `123456`, plus **Reset synthetic demo**. | Passed. |
| Hindi confirmation date | Hindi confirmation displayed `१२ सितंबर २०२६`. | Passed. |
| Image/PDF export | This historical build showed both image and PDF download controls. The current release intentionally retains PDF and share actions and removes image export to keep the confirmation surface focused. | Historical checkpoint; current behavior is documented in the judge submission brief. |
| Unit/build validation | `pnpm check`, `pnpm test`, and `pnpm build:vercel` passed locally. Vitest covered 5 files / 10 tests, including remote reminder hydration, date formatting, and PDF-shell tests. | Passed. |
| Persisted mock reminders | Vercel production tRPC reminder mutation followed by pensioner readback returned `sms: false`, `voice: true`, and `family: false`; the synthetic state was reset afterward. | Passed. |
| Vercel catch-all routing | Corrected `build:vercel` to overwrite the committed `api/[...path].js` bundle targeted by `vercel.json`, then verified the new production deployment as Ready. | Passed. |

## Synthetic Supabase Connection

The active adapter targets Supabase project `ehwwpesbwvohrazllutu` through two public, whitelisted synthetic Edge Functions: `sahara-pramaan-prototype` and `sahara-pramaan-family-assist`. A live non-mutating `DEMO-PASS` login call to `sahara-pramaan-prototype` returned HTTP 200 and the expected synthetic pensioner response on 26 August 2026.

The adapter intentionally falls back to the deterministic local synthetic store if an Edge Function is unavailable. Supabase operations cover synthetic login, status, fingerprint/liveness simulation, family-link state, mock reminder preferences, and reset. The separate app-server Maps adapter may request transient geocoding and nearby Places data through the secure proxy; it does not persist device coordinates or live Places results. No real personal, financial, pension, biometric, identity, or messaging data is requested or retained by this prototype.

## Public Source and Deployment

The public source release now includes [`81aba6e`](https://github.com/apranav1711-byte/sahara-pramaan/commit/81aba6e79cb368116f6cd72d54d873403e31f829), which versions both Supabase Edge Function sources, hydrates persisted reminder preferences, adds regression coverage, and removes the unresolved optional analytics placeholder, followed by [`597fc49`](https://github.com/apranav1711-byte/sahara-pramaan/commit/597fc494cd68e41dfa6f74d27057e2d816c152d7), which aligns the Vercel build output with the deployed catch-all rewrite. The resulting production deployment is [`sahara-pramaan-ckawubv1d-pranav-aggarwals-projects-c0ba8f4d.vercel.app`](https://sahara-pramaan-ckawubv1d-pranav-aggarwals-projects-c0ba8f4d.vercel.app), aliased as [`sahara-pramaan.vercel.app`](https://sahara-pramaan.vercel.app), and its tRPC gateway was smoke-tested after deployment.
