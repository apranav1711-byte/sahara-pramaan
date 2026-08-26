# Production QA Session — 26 August 2026

> **Historical evidence log:** This record contains checkpoint-specific observations from earlier releases. The final-release addendum at the end and [`docs/judge-submission.md`](./judge-submission.md) are authoritative for the current build. Older references to English fallback, image export, or previous deployment hashes are retained only as historical evidence.

## Scope

This record describes the final production verification of Sahara Pramaan’s **independent, synthetic-only** public prototype. It is deliberately limited to facts observed in the public GitHub and Vercel releases, synthetic demonstration interactions, and repeatable local source validation. It does not treat illustrative state, mock credentials, or browser automation limitations as evidence of a real pension, biometric, government, financial, or messaging service.

| Area | Evidence | Result |
| --- | --- | --- |
| Public source | GitHub `main`, commit `9e2d178` | Latest reminder-save Hindi mapping committed. |
| Production build | Vercel marked deployment `sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app` Ready | Public deployment-specific build available. |
| Hindi reminders | `DEMO-FAIL` reminder save on that exact deployment | Hindi no-message toast observed. |
| English reminders | Same screen switched to English and saved | English no-message toast observed. |
| Confirmation localization | Exact deployment inspected in Hindi and English | Status, labels, synthetic-only warning, and English fallback verified; Hindi date remains source-format English month text. |
| Source validation | `pnpm check`, `pnpm test`, `pnpm build` | Passed; isolated public-main validation covered 3 files / 5 tests and the managed workspace covered 4 files / 6 tests; builds produced only a non-blocking Vite size warning. |
| Two-page family assist | Two independent Chromium pages on the exact public deployment | The first pensioner page rendered submitted status 2 ms after the second page rendered completion, 2,842 ms after the completion action began. |
| Reduced motion and focus | Chromium reduced-motion emulation and keyboard inspection | Motion media query matched; animation durations became `0.00001s`; keyboard focus had a 3px solid outline. |
| Read aloud | Instrumented browser-native speech-synthesis invocation | The public control invoked speech synthesis once; physical audio remains outside sandbox scope. |

## Verified Production Behavior

The public production page continues to present the independent-prototype and synthetic-data-only boundary before a user enters the test flow. The `DEMO-FAIL` and `DEMO-PASS` accounts with mock OTP `123456` remain synthetic recording aids; no real messaging is sent as part of the login path.

The final reminder preference release was validated through actual UI interactions, not by inspecting source alone. Hindi save feedback read **“मॉक पसंद सहेज ली गईं। कोई संदेश नहीं भेजा जाएगा।”** and English save feedback read **“Mock preferences saved. No message will be sent.”**. This supports the intended limitation that the feature records only mock preferences and does not initiate real communications.

The confirmation page was also inspected in both languages on the same release. It explicitly distinguishes itself from a government certificate and says no official life certificate, payment status, SMS, bank record, or government update was created. The static date string in Hindi is not localized to Hindi month formatting, so full locale-specific date formatting remains outside the verified scope.

## Direct Two-Page and Accessibility Evidence

The final isolated Chromium run started a fresh synthetic `DEMO-FAIL` journey on the exact deployment-specific build, opened its generated family-assist URL in a distinct second page, and left the original pensioner page showing **Family assistance pending**. The second page completed the visible synthetic answer at `13:44:11.049Z`, rendered **Support completed** at `13:44:13.889Z`, and the first page visibly rendered **Submitted in this demo** at `13:44:13.891Z`. This is 2 ms after second-page rendering and 2,842 ms from the completion action start, satisfying the five-second target with direct two-page evidence.

The final accessibility run emulated `prefers-reduced-motion: reduce` in Chromium. The public media query matched, and `.float-gentle` plus `.page-enter` computed to `0.00001s` animation duration. Keyboard `Tab` focus had a 3px solid outline. A controlled instrumentation shim observed one browser-native speech-synthesis invocation after selecting **Read this aloud**. This demonstrates control invocation only; physical sandbox audio output is not asserted.

## Delivery Completion and Deferred Video

The reconciled QA records were committed to the public GitHub branch as [`7edbce4`](https://github.com/apranav1711-byte/sahara-pramaan/commit/7edbce4d9207687f8130d6801adf3f9dfd219757), and the completed checklist was committed as [`8f79288`](https://github.com/apranav1711-byte/sahara-pramaan/commit/8f792888c41aeb02ddc0650b47536b473f9f3147). A concise completion email containing the public URL, repository link, synthetic demonstration credentials, QA state, and video-deferred note was sent to `apranav1711@gmail.com` after these checks.

The only deliberately deferred deliverable is the final demo video. It must not be generated until the user supplies the requested screen-recording walkthrough, and any eventual video must preserve the prototype’s synthetic-only and non-government disclosures.

## Public References

| Resource | URL |
| --- | --- |
| Public repository | https://github.com/apranav1711-byte/sahara-pramaan |
| Final source commit | https://github.com/apranav1711-byte/sahara-pramaan/commit/9e2d1789e5a241b903ffca02d89de42368167fd7 |
| Deployment-specific build | https://sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app |
| Public alias | https://sahara-pramaan.vercel.app |

## Final Release Addendum — 27 August 2026

This document contains historical production evidence from earlier commits as well as the final-release reconciliation below. The historical sections that mention English fallback, English/Hindi-only coverage, image export, or older deployment hashes should not be read as descriptions of the current build.

The current judge-facing release is GitHub commit `63e8637` with READY Vercel deployment `dpl_5BsbWR3xSP8zSf7baTnXqMdxntsu`. Its public smoke suite passed the manifest, service worker, synthetic login, camp list, live-or-synthetic support locations, family-link creation, reminder write/readback, and reset checks. The support-location response was `source: "synthetic"` in the current provider environment; live Google Places data is therefore not claimed as observed evidence.

The current client renders critical-path copy in ten supported languages through explicit React locale dictionaries. Kannada was visually verified on the deployed landing and login journeys, including translated shell controls, preview labels, onboarding copy, and authentication disclosure. The current confirmation route retains PDF/share actions and does not offer image export. The current test suite contains 7 files and 16 passing tests.
