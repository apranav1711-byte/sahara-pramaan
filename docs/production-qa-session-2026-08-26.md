# Production QA Session — 26 August 2026

## Scope

This record describes the final production verification of Sahara Pramaan’s **independent, synthetic-only** public prototype. It is deliberately limited to facts observed in the public GitHub and Vercel releases, synthetic walkthrough interactions, and repeatable local source validation. It does not treat illustrative state, mock credentials, or browser automation limitations as evidence of a real pension, biometric, government, financial, or messaging service.

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

The final isolated Chromium run started a fresh synthetic `DEMO-FAIL` journey on the exact deployment-specific build, opened its generated family-assist URL in a distinct second page, and left the original pensioner page showing **Family assistance pending**. The second page completed the visible synthetic answer at `13:44:11.049Z`, rendered **Support completed** at `13:44:13.889Z`, and the first page visibly rendered **Submitted in this prototype** at `13:44:13.891Z`. This is 2 ms after second-page rendering and 2,842 ms from the completion action start, satisfying the five-second target with direct two-page evidence.

The final accessibility run emulated `prefers-reduced-motion: reduce` in Chromium. The public media query matched, and `.float-gentle` plus `.page-enter` computed to `0.00001s` animation duration. Keyboard `Tab` focus had a 3px solid outline. A controlled instrumentation shim observed one browser-native speech-synthesis invocation after selecting **Read this aloud**. This demonstrates control invocation only; physical sandbox audio output is not asserted.

## Delivery Completion and Deferred Video

The reconciled QA records were committed to the public GitHub branch as [`7edbce4`](https://github.com/apranav1711-byte/sahara-pramaan/commit/7edbce4d9207687f8130d6801adf3f9dfd219757), and the completed checklist was committed as [`8f79288`](https://github.com/apranav1711-byte/sahara-pramaan/commit/8f792888c41aeb02ddc0650b47536b473f9f3147). A concise completion email containing the public URL, repository link, synthetic walkthrough credentials, QA state, and video-deferred note was sent to `apranav1711@gmail.com` after these checks.

The only deliberately deferred deliverable is the final product video. It must not be generated until the user supplies the requested screen-recording walkthrough, and any eventual video must preserve the prototype’s synthetic-only and non-government disclosures.

## Current presenter refinement audit

The managed workspace now also contains the one-tap Copy steps card, hideable Quick-start panel, Support code wording, and print-only confirmation CSS. Copy steps was browser-verified with the success toast. The native Print confirmation action opened a system dialog that timed out in interactive automation. A clean headless Chromium run then emulated print media and generated a one-page PDF; computed styles confirmed the header, footer, and print-hide controls were removed, the confirmation card remained visible, and the non-official disclosure text was retained in the PDF.

## Public References

| Resource | URL |
| --- | --- |
| Public repository | https://github.com/apranav1711-byte/sahara-pramaan |
| Final source commit | https://github.com/apranav1711-byte/sahara-pramaan/commit/9e2d1789e5a241b903ffca02d89de42368167fd7 |
| Deployment-specific build | https://sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app |
| Public alias | https://sahara-pramaan.vercel.app |
