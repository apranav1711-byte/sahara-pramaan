# Sahara Pramaan — Recording and QA Runbook

This runbook is for the synthetic public prototype only. It is designed to make a clean two-minute demo take repeatable without relying on random verification outcomes.

## Before recording

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Open the deployed URL in a fresh browser session. | The landing page loads without a login wall. |
| 2 | Open the comfort menu once. | Large type, high contrast, Hindi/English, read-aloud, disclosure, and reset controls are visibly available. |
| 3 | Choose **Reset synthetic demo**. | Any earlier family-assist completion state is cleared. |
| 4 | Sign in with `DEMO-FAIL` and OTP `123456`. | Kamala Devi’s synthetic home is shown. |
| 5 | Keep the first window open throughout the family-assist sequence. | The status poll can visibly demonstrate the update. |

## Core recording sequence

1. On the pensioner home, explain the simple due-date status in plain language.
2. Start verification and wait for the deterministic simulated fingerprint failure.
3. Choose face and liveness, briefly show either camera permission or the camera-denied fallback, and complete the simulated result.
4. Reset the synthetic demo, return to `DEMO-FAIL`, and choose **Ask family to help**.
5. Copy the public family-assist link and open it in a second window in the same browser profile or same incognito session.
6. Complete the synthetic shared-memory answer shown on the family screen.
7. Switch back to the pensioner window and wait no more than five seconds for the status to update.
8. Show the synthetic confirmation image, the illustrative camp locator, and one accessibility control.

## Critical disclosure phrases

Use these phrases or equivalent wording during the demo:

> “This prototype intentionally forces a fingerprint failure for this demo account so the fallback options can be demonstrated.”

> “No real biometric matching, government database, bank system, messaging service, or official certificate is involved.”

> “The family-assist step is a prototype assistance flow, not a secure identity-verification method.”

## Troubleshooting

If a previous demo state appears, use **Reset synthetic demo**. If camera permission is unavailable, use the visible **Continue without a camera** path. If the family share link appears expired, reset the demo and create a fresh link from the pensioner’s fallback options. If a browser blocks the copy action, copy the displayed link manually.
