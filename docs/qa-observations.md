# QA Observations

## Development Preview — Initial Check

The public landing screen loads without a login wall and visibly presents the independent-prototype disclosure. The primary call to action leads to the synthetic login screen. The fallback demo account is prefilled as `DEMO-FAIL` with mock OTP `123456`, and the login screen clearly labels its synthetic-data constraints.

The development preview is marked as preview-only by the platform. A final public publishing action is still required after the complete project checkpoint is saved.

## Development Preview — Synthetic Status Check

The Supabase-backed pensioner query loads successfully after login and presents the styled pensioner home. The visual QA session initially observed an already completed synthetic status because the remote family-assist smoke test had intentionally completed the `DEMO-FAIL` record. This confirms that remote state is visible to the browser. A final reset must be executed before recording so the deterministic fallback journey starts from a due status.

## Development Preview — Accessibility and Reset Check

The header menu exposes the required larger-text switch, high-contrast switch, language control, browser-native read-aloud action, complete disclosure link, and deterministic synthetic-demo reset. All controls have prominent touch targets and remain visually legible in the preview.

## Development Preview — Reset-to-Login Validation

The reset action returns the application to the landing page and a subsequent login begins with the deterministic `DEMO-FAIL` credentials prefilled. This confirms that the app can return to a known recording-ready start state after a completed family-assist test.

## Development Preview — Clean Fallback Account Check

After reset and login, `DEMO-FAIL` correctly loads the due-status pensioner home rather than a prior submitted status. The public preview shows the clear due date, plain-language status copy, start-verification action, camp locator, comfort controls, and mock reminder preference entry point.

## Development Preview — Deterministic Fallback Check

The `DEMO-FAIL` fingerprint step presents a visible simulated-capture state and then deterministically reaches the fallback screen. The fallback screen clearly explains that the demo account intentionally forces this outcome and presents all three required alternatives: simulated face/liveness, family assistance, and illustrative camp discovery. The disclosure that no real biometric, camp, banking, government, SMS, or voice-call system is connected remains visible.

## Development Preview — Family Link Check

The fallback flow successfully creates a public synthetic family-assist link and displays a short recording-ready code together with same-browser-profile instructions. The screen repeats the explicit prototype limitation: this is assistance, not a secure or production-ready verification method.

## Development Preview — Family Link Rendering Check

Opening the generated `?assist=` URL bypasses the pensioner login and presents the family-assist screen directly. The assistance page no longer shows the unrelated pensioner loading panel. It provides the synthetic question, visibly shows the demo answer for recording reliability, and retains the prototype/not-impersonation disclaimer.

## Development Preview — Family Completion Check

Submitting the visible synthetic answer completes the public family-assist flow and presents the completion state without a login requirement. The result explicitly says that the update is synthetic and that no real certificate, account, or notification was created. The same update is stored in the connected Supabase prototype state for the pensioner window to retrieve.

## Development Preview — Shared-State Re-entry Check

After the family completion, the pensioner entry point remains public and accepts the deterministic synthetic login again. The next validation step is the post-assistance home state, which confirms that the stored family completion is visible to the pensioner journey.

## Development Preview — Cross-Journey Status Result

Re-entering as `DEMO-FAIL` after family completion retrieves the shared synthetic state and shows **Submitted in this demo** on the pensioner home. This validates that the two journeys use the same connected Supabase-backed prototype status rather than independent browser-only state.

## Development Preview — Translation Control Check

The accessibility menu remains available from the public landing screen after the translation update, with an explicit English/Hindi language control alongside larger-text, high-contrast, and read-aloud controls.

During development hot reload, the client-only comfort settings reset to English. This is expected in the current prototype session model; the Hindi control remains available and translates the visible core-flow copy when selected.

## Development Preview — Secondary Module Entry

After the accessibility persistence update, the public landing page and deterministic mock login remain visually stable. The prefilled fallback account remains ready to reach the camp locator and mock reminder preference modules for subsequent QA.

## Development Preview — Mock Camp Locator Check

The camp locator opens from the pensioner home and displays a clear mock-pincode field, decorative non-geographic map, and synthetic camp cards sorted by illustrative distance. The visible copy states that a family member, volunteer, or assisted device can use the locator and that locations and distances are not live service information.

Changing the mock pincode from `110001` to `110075` changes the displayed camp ordering, with Sukoon Community Hall moving to the nearest illustrative position. The return path leads back to the pensioner home without losing the shared synthetic status.

## Development Preview — Mock Reminder Check

The reminder screen clearly presents synthetic SMS, voice-call, and family-support preference controls, then confirms on save that no message will be sent. No email, SMS, voice call, or user-facing notification service is invoked by this feature.

## Live Two-Window Polling Verification — Setup

The synthetic remote state was reset and a fresh public family-assist token was created. A new first-window pensioner session is now at the deterministic `DEMO-FAIL` login screen, ready to remain open while a separate synthetic client completes the family action.

## Live Two-Window Polling Verification — Precise Run Setup

A second fresh pending-state run has been prepared with token `assist-5b460e7f-6`. The first pensioner window has been reopened from the public landing flow and is ready to remain in place while the separate client triggers the family completion.

## Browser-to-Browser Two-Window Verification — Setup

A final fresh public family-assist token `assist-6aa9e391-2` has been created. The first browser window has entered the `DEMO-FAIL` login flow and will remain on the pending pensioner status while the public family-assist page is opened separately in a second browser tab.

The first browser window is visibly pending and has a timestamped status observer active at `1787732471825`. A direct script popup was blocked by the browser because it was not created from a user gesture, so the next verification step uses a visible target-blank link and a real browser click to open the family-assist page in a second tab.

The visible target-blank link is present in the first browser window while **Family assistance pending** remains displayed. The browser automation confirms that the link points to the public `?assist=assist-6aa9e391-2` route and is ready to open the second-tab family-assist form via a genuine click.

The target-blank link was activated while the first pensioner tab remained visibly pending. The browser environment did not switch tab focus through the standard tab shortcut, so the validation continues through an alternate browser navigation method while preserving the first tab and its active observer.

The visible test link now targets a stable browser window named `saharaFamilySecondWindow`. This lets the test retain the first tab’s live observer while referring to the publicly opened family-assist page as a distinct browser window.

For the precise run, a DOM observer was installed in the pending pensioner window at `1787732308889`. The separate synthetic client started completion at `1787732318110` and received its submitted-state response at `1787732318673`. The next step records the observed visible UI transition timestamp from the still-open pensioner window.

The open pensioner window’s DOM observer recorded its first visible **Submitted in this demo** transition at `1787732320454`. This is **1,781 ms** after the separate client received its completion response, confirming that the already-open pensioner view updates within the required five seconds in the measured live run.

## Responsive and Accessibility Safeguards

The public landing page was reviewed at both 375px and 360px mobile widths after the final server restart. It retains readable headline wrapping, full-width primary actions, three visible alternative-path cards, and no horizontal overflow. The global stylesheet applies a high-visibility `:focus-visible` outline to interactive elements and a `prefers-reduced-motion: reduce` media rule that disables non-essential animation and transitions. Large-text and high-contrast controls are exposed from the header comfort menu, and the browser-native read-aloud action is available on all core screens.

### 360px Review Findings

The 360px capture shows no clipped navigation, horizontal scroll, or off-canvas footer content. The menu button and primary/secondary call-to-action buttons remain approximately 48px or taller; the primary actions use the full available width. The three alternative-path cards remain visible without overlap, with labels wrapping onto two lines where needed but remaining legible. The certificate-preview card scales below the actions without collision. No 360px-specific CSS correction was required after this review.

## Language Rendering Baseline

The refreshed English landing and comfort menu were checked before the Hindi pass. The header retains read-aloud, disclosure, language, large-text, high-contrast, reset, and menu controls, with all English labels visible and reachable.

The Hindi pass was then checked in the same browser. The brand descriptor, read-aloud and disclosure links, comfort-menu labels, language label, large-text and contrast descriptions, reset action, prototype badge, hero copy, primary actions, alternative-path cards, certificate-preview labels, and footer disclosure all rendered in Hindi. The core navigation and landing guidance now have explicit browser-verified Hindi and English coverage.

The synthetic login screen was also checked in Hindi. Its title, account labels, input labels, demo-type labels, instructions, navigation, and continue action rendered in Hindi. The only split acknowledgement fragment initially remaining in English was added explicitly to the dictionary and the code then passed TypeScript validation again.

## Build and Test Verification

The production build completed successfully with Vite and the server bundle. TypeScript completed with zero errors, and the configured Vitest suite passed all five tests across authentication logout behavior, deterministic synthetic demo-state behavior, and the two-second family-status polling contract. The build emitted only a bundle-size optimization warning; it did not block the production build or the current prototype flows.

## Live Two-Window Polling Verification — Result

The first pensioner window remained open in the browser with **Family assistance pending** displayed. A separate client completed the newly issued public family-assist token at `08:15:54.469`. The next client polling request began at `08:15:54.209` and returned after the remote completion; the pensioner window visibly switched to **Submitted in this demo** by the next rendered observation. The measured request cadence is two seconds, and the status refresh occurred within one second of the separate-client completion in this run.

## Final Public Deployment Check — 26 August 2026

The public GitHub `main` branch reached commit [`9e2d178`](https://github.com/apranav1711-byte/sahara-pramaan/commit/9e2d1789e5a241b903ffca02d89de42368167fd7), **Translate reminder save notification**. Vercel marked the matching production deployment as Ready at the deployment-specific URL [`sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app`](https://sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app). This release was the final Hindi mapping for the synthetic reminder-save toast; it did not introduce a service integration or change any synthetic-data boundary.

On that exact build, a real `DEMO-FAIL` synthetic login was used to open reminder preferences. Saving preferences in Hindi showed **“मॉक पसंद सहेज ली गईं। कोई संदेश नहीं भेजा जाएगा।”**. The same screen was switched visibly to English, saved again, and showed **“Mock preferences saved. No message will be sent.”**. Both reminder descriptions continue to state that the controls save mock preferences only and do not send SMS, calls, or family alerts.

The same deployment-specific build was then checked on the confirmation route in Hindi and English. Hindi rendered the confirmation heading, active-status sentence, prototype reference label, verification-path label and the explicit artificial-prototype warning. English rendered the equivalent heading, date sentence, **SYNTHETIC PROTOTYPE — NOT A GOVERNMENT CERTIFICATE** warning, reference, family verification path, and the statement that no official certificate, payment status, SMS, bank record, or government update was created. The date itself remains in the source-format English month form (`31 August 2026`) when Hindi is selected; this is known presentational behavior and must not be represented as fully localized date formatting.

The public `main` checkout passed `pnpm check`, `pnpm test` (3 files and 5 tests), and `pnpm build` on 26 August 2026. Vite reported a non-blocking chunk-size optimization warning during the successful production build.

### Evidence Limitation — First-Window Family Update

The implementation has a two-second polling contract, and the earlier measured run recorded the first pensioner-view transition 1,781 ms after separate-client completion. A real browser second tab also completed the public synthetic family-assist form. However, the browser automation switched control to the second tab and did not provide a usable return to observe the original first tab during that production run. Therefore this record does **not** claim direct production-browser observation of the first window updating within five seconds. The associated checklist items remain open until that specific observation is captured.

### Accessibility Evidence Limitation

The current public build exposes larger-text, high-contrast, language, reset, and browser-native read-aloud controls. Visible keyboard focus has previously been confirmed as a 3px gold focus outline, and the stylesheet contains a `prefers-reduced-motion: reduce` rule. This session did not emulate reduced motion in a browser, and sandbox tooling cannot confirm that the device actually emits spoken audio. Those limits remain explicit in the accessibility checklist.

> **Resolution note:** The later direct Chromium checks recorded below did emulate reduced motion, verified its computed animation durations, and instrumented one speech-synthesis invocation. Physical audio output remains outside the sandbox’s observable scope.

## Direct Two-Page Production Evidence — 26 August 2026

An isolated Chromium session opened the exact Ready deployment-specific build in **two independent pages**. It used only the visible `DEMO-FAIL` synthetic journey: reset, synthetic login, deterministic fingerprint fallback, create family link, return the first pensioner page to **Family assistance pending**, open the generated `?assist=` link in the second page, enter the on-screen synthetic answer, and complete assisted verification.

The second page began completion at `13:44:11.049Z`, rendered **Support completed** at `13:44:13.889Z`, and the first pensioner page visibly rendered **Submitted in this demo** at `13:44:13.891Z`. The observed first-window transition was **2 ms after the second-page completion rendering** and **2,842 ms from the completion action start**, satisfying the required under-five-second result. Full-page screenshots of both independent pages and the timestamped JSON result were retained in the isolated QA workspace.

## Direct Accessibility Evidence — 26 August 2026

The same exact production build was tested in Chromium with `prefers-reduced-motion: reduce` emulated. The media query matched and computed animation durations for both `.float-gentle` and `.page-enter` were `0.00001s`, demonstrating that the reduced-motion rule took effect. Keyboard `Tab` focus reached the branded home button and computed a visible `3px` solid focus outline. The public **Read this aloud** button invoked the browser speech-synthesis method once under a controlled instrumentation shim. This verifies invocation, not physical audio output from the sandbox.
