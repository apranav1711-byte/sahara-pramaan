# Enhancement Release QA — 26 August 2026

## Scope

This release adds only **synthetic prototype** convenience features. It does not add a real certificate, identity, biometric, pension, payment, messaging, or government-system integration.

| Enhancement | Production verification | Result |
| --- | --- | --- |
| Recording mode | Public landing page exposed `DEMO-FAIL`, `DEMO-PASS`, and `DEMO-MIXED`, each with mock OTP `123456`, plus **Reset synthetic demo**. | Passed. |
| Hindi confirmation date | Hindi confirmation displayed `१२ सितंबर २०२६`. | Passed. |
| Image/PDF export | Confirmation showed both image and PDF download controls. The public Hindi PDF flow displayed a success notice and produced a 104,061-byte file with `%PDF-1.4` header. | Passed. |
| Unit/build validation | `pnpm check`, `pnpm test`, and `pnpm build` passed locally. Vitest covered 5 files / 9 tests, including date formatting and PDF-shell tests. | Passed. |

## Synthetic Supabase Connection

The active adapter targets Supabase project `ehwwpesbwvohrazllutu` through two public, whitelisted synthetic Edge Functions: `sahara-pramaan-prototype` and `sahara-pramaan-family-assist`. A live non-mutating `DEMO-PASS` login call to `sahara-pramaan-prototype` returned HTTP 200 and the expected synthetic pensioner response on 26 August 2026.

The adapter intentionally falls back to the deterministic local synthetic store if an Edge Function is unavailable. The only exposed operations cover synthetic login, status, fingerprint/liveness simulation, family-link state, mock reminder preferences, and reset. No real personal, financial, pension, biometric, identity, location, or messaging data is requested or retained by this prototype.

## Public Source and Deployment

The public source release consists of GitHub commits [`4545168`](https://github.com/apranav1711-byte/sahara-pramaan/commit/4545168de973bb07b503c3dff69fc6248f19a7bc), [`72a265e`](https://github.com/apranav1711-byte/sahara-pramaan/commit/72a265e9b57206284500e1b11a4ef175d58dda05), and [`1b5a79c`](https://github.com/apranav1711-byte/sahara-pramaan/commit/1b5a79cc562632b8a3d49da49641fde366af8732). The public alias [`sahara-pramaan.vercel.app`](https://sahara-pramaan.vercel.app) was checked after deployment and rendered the new recording panel, Hindi date, and export controls.
