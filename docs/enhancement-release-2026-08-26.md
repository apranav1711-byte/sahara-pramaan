# Enhancement Release QA — 26 August 2026

## Scope

This release adds only **synthetic prototype** convenience features. It does not add a real certificate, identity, biometric, pension, payment, messaging, or government-system integration.

| Enhancement | Production verification | Result |
| --- | --- | --- |
| Quick-start routes | Public landing page exposes `DEMO-FAIL`, `DEMO-PASS`, and `DEMO-MIXED`, each with mock OTP `123456`, plus **Reset synthetic session**. | Passed in the validated managed workspace. |
| Hindi confirmation date | Hindi confirmation displayed `१२ सितंबर २०२६`. | Passed. |
| Image/PDF export | Confirmation showed both image and PDF download controls. The public Hindi PDF flow displayed a success notice and produced a 104,061-byte file with `%PDF-1.4` header. | Passed. |
| Unit/build validation | `pnpm check`, `pnpm test`, and `pnpm build` passed locally. Vitest covered 5 files / 9 tests, including date formatting and PDF-shell tests. | Passed. |

## Synthetic Supabase Connection

The active adapter targets Supabase project `ehwwpesbwvohrazllutu` through two public, whitelisted synthetic Edge Functions: `sahara-pramaan-prototype` and `sahara-pramaan-family-assist`. A live non-mutating `DEMO-PASS` login call to `sahara-pramaan-prototype` returned HTTP 200 and the expected synthetic pensioner response on 26 August 2026.

The adapter intentionally falls back to the deterministic local synthetic store if an Edge Function is unavailable. The only exposed operations cover synthetic login, status, fingerprint/liveness simulation, family-link state, mock reminder preferences, and reset. No real personal, financial, pension, biometric, identity, location, or messaging data is requested or retained by this prototype.

## Public Source and Deployment

The public source release consists of GitHub commits [`4545168`](https://github.com/apranav1711-byte/sahara-pramaan/commit/4545168de973bb07b503c3dff69fc6248f19a7bc), [`72a265e`](https://github.com/apranav1711-byte/sahara-pramaan/commit/72a265e9b57206284500e1b11a4ef175d58dda05), and [`1b5a79c`](https://github.com/apranav1711-byte/sahara-pramaan/commit/1b5a79cc562632b8a3d49da49641fde366af8732). The public alias [`sahara-pramaan.vercel.app`](https://sahara-pramaan.vercel.app) was checked after deployment and rendered the new recording panel, Hindi date, and export controls.

## Presenter and print refinement audit — 27 August 2026

The restored release was reviewed end to end across source, tests, documentation, integration records, and the managed preview. The presenter experience now includes a one-tap **Copy steps** action, a collapsible **Quick-start** panel containing the three synthetic routes and reset action, and wording that avoids hackathon framing while preserving independent, synthetic-only, and non-official disclosures. The confirmation view includes **Print confirmation** and print-only CSS that removes navigation and action controls while preserving the confirmation watermark and boundary text. The native browser print invocation opened a system dialog that timed out in the interactive automation session. A separate clean headless Chromium run emulated print media and generated a one-page PDF; computed styles confirmed header, footer, and print-hide actions were removed, the confirmation card remained visible, and the non-official disclosure text was retained in the PDF.

The integrated local validation passed with `pnpm check`, **6 test files / 11 tests**, and `pnpm build`. The preview was visually checked at desktop and 360px widths. The quick-start panel was opened and collapsed interactively; the collapsed state removes the presenter-only route panel. A persistent Vite chunk-size warning remains non-blocking. These refinements are validated in the managed workspace and require a subsequent public-source/deployment sync before they can be claimed as live production behavior.

## Presenter credentials, printable preview, and confirmation feedback — 27 August 2026

The current integrated audit added a one-tap **Copy credentials** action next to **Copy steps**. Its payload contains only the three intentionally synthetic route identifiers (`DEMO-FAIL`, `DEMO-PASS`, and `DEMO-MIXED`), mock OTP `123456`, the expected route labels, and an explicit no-real-service boundary. English and Hindi success feedback were verified in the managed preview.

The confirmation card now includes **Save printable preview**, which produces an A4-proportioned `1240 × 1754` PNG with a prominent synthetic-prototype/non-official header and a retained boundary notice. Browser QA produced a valid PNG download and observed the completion toast. The card also shows a brief, polite `role="status"` preparation overlay before it appears. An isolated browser check observed the overlay, its `aria-live="polite"` attribute, and the `confirmation-prep` animation running for `1.1s`; the captured image confirmed legible loading copy. Reduced-motion preferences bypass the delay.

The combined local validation passed `pnpm check`, **6 test files / 12 tests**, and `pnpm build`. The only build output was the pre-existing non-blocking Vite chunk-size advisory. The verified source was synchronized to public GitHub `main` as [`35ebf7b`](https://github.com/apranav1711-byte/sahara-pramaan/commit/35ebf7be95ceff2a485abe949160748e45a9a349), and the public alias served the new Copy credentials action, printable-preview control, non-official certificate notice, and image-download toast during a direct browser check.

## Persistent dark mode — 27 August 2026

The comfort-controls menu now provides a keyboard-accessible **Dark mode** switch with `role="switch"` and an accurate `aria-checked` state. The setting persists as a validated `light` or `dark` local preference, applies the root `dark` class through the existing theme provider, and is available in both English and Hindi. The low-light palette preserves readable foregrounds, warm Sahara accent color, prominent independent/synthetic-only disclosures, and the confirmation safeguards. High contrast takes precedence when both accessibility preferences are enabled.

Local browser verification covered the Hindi and English labels, dark-mode activation, reload persistence, and the combined dark/high-contrast state. The release gate passed `pnpm check`, **7 Vitest files / 14 tests**, `pnpm build`, and `git diff --check`. The only build output remains the non-blocking Vite chunk-size advisory.

## System preference and theme transition refinement — 27 August 2026

When no explicit preference exists, Sahara Pramaan now begins in the operating system’s light or dark color-scheme before React renders, preventing an unnecessary flash of the opposite palette. A deliberate manual selection remains persistent and overrides later system changes. The document’s browser-chrome color is kept in sync with the active palette.

Manual light/dark changes use a short `280ms` color transition and a `180ms` text-color transition with an ease-out curve. The transient transition class is never applied when `prefers-reduced-motion: reduce` is active; high-contrast preference continues to take visual precedence. Unit coverage confirms system-default selection, saved-preference precedence, and reduced-motion transition suppression. The final release gate passed `pnpm check`, **7 Vitest files / 16 tests**, `pnpm build`, and `git diff --check`; the Vite chunk-size advisory remains non-blocking.
