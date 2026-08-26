# Sahara Pramaan India Hackathon Roadmap

## Product direction

The strongest positioning for Sahara Pramaan is not “another digital form.” It is a **calm, multilingual, assisted completion service** for older adults, families, volunteers, and assisted-service operators. The project should demonstrate inclusion, trust, and recovery when a digital step fails. Every feature should answer three questions: Can a pensioner understand it? Can a family member help without impersonating them? Can the service recover when a device, network, or biometric step fails?

## Implemented in the current release

| Feature | Status | Hackathon value |
| --- | --- | --- |
| English and Hindi experience | Working, with persisted user selection. | Demonstrates immediate accessibility for a major Indian user group. |
| Preferred-language selector | Working for English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, and Punjabi. Hindi has the deepest static translation coverage; other selections retain the preference and use an English fallback where content is not yet translated. | Shows a scalable India-first language model without pretending unsupported translation is complete. |
| Read-aloud control | Working with explicit **Read this aloud**, **Repeat instruction**, and **Stop reading** actions. Speech also stops when the user changes screen or language. | Directly supports low-literacy and assisted-device use. |
| Light and dark themes | Working and persisted per device. | Improves comfort in bright outdoor and low-light settings. |
| PIN and location assistance | Six-digit Indian PIN input is validated and used for synthetic area sorting. Optional browser location permission reports temporary device accuracy without storing coordinates. | Demonstrates consent-aware location handling. |
| Family assistance | Working with expiring synthetic links, bounded attempts, cross-window updates, and clear non-impersonation wording. | Shows human-in-the-loop recovery instead of forcing a single biometric path. |
| Offline and degraded mode | Working service shell, explicit offline state, session-only fallback indicator, and reset. | Shows practical resilience for uneven connectivity. |

## Highest-value additions for judging

| Priority | Feature | Why it matters | Safe implementation approach |
| --- | --- | --- | --- |
| 1 | Assisted operator mode | A volunteer or post-office helper should be able to guide a user through the same journey without taking ownership of the account. | Add a clearly labeled helper mode with large step cards, session handoff, consent confirmation, and an end-of-session summary. Keep it synthetic until identity and authorization requirements are approved. |
| 2 | Voice-first navigation | Many users will be more comfortable listening than reading. | Add short, localized prompts and a repeat/stop control for each step. Avoid continuous background speech and provide a visible transcript. |
| 3 | Human escalation | Digital fallback should lead to a person when the user is stuck. | Add a synthetic “request a callback” or “find an assisted desk” flow, clearly labeled as a demo. For production, integrate an approved helpdesk or call-center provider. |
| 4 | India service directory | A real directory of post offices, CSCs, bank correspondents, and assisted-service centers would create practical value. | Start with an administrator-managed directory and verified source timestamps. Use ordinary PIN code for area filtering, not exact household location. |
| 5 | Local-language content system | A language selector is only complete when critical content is translated, not merely when the option exists. | Move UI strings into locale files and complete critical-path translations with native review for all selected Indian languages. |
| 6 | Consent and privacy center | Trust is a key differentiator for older adults and families. | Add a plain-language “what we use / what we do not use” panel, location consent history, session deletion, and export/delete controls. |
| 7 | Accessibility proof | Demonstrable accessibility is stronger than a claim. | Add keyboard-only acceptance tests, screen-reader landmarks, color-contrast checks, reduced-motion checks, and mobile touch-target screenshots. |

## Authentication decision

The current synthetic login is the correct default for a safe public hackathon demo. A real Google login is feasible, but it is not just a button: it needs a Google Web OAuth client, authorized origins and redirects, server-side ID-token validation, consent/privacy copy, and a user-account mapping. Google’s current documentation also warns that the older Google Sign-In library is deprecated and recommends the current Identity Services/FedCM-compatible path.[1]

WhatsApp OTP is possible only with a server-side WhatsApp Business Platform integration. It requires a verified sender, Meta Business setup, approved authentication templates, language/locale configuration, opt-in, rate limits, delivery handling, and secure credentials. The browser must never send WhatsApp credentials or generate trusted OTP state by itself.[2]

For judging, the recommended presentation is to show a **provider-ready authentication architecture** rather than a fake live login. Use the synthetic flow for the recording and explain that Google or WhatsApp can be enabled in a controlled deployment after credentials and consent are supplied. This is more credible than showing an unverified “real” OTP button.

## Location decision

A six-digit Indian PIN code identifies a broad postal area; it does not provide exact household coordinates. India Post describes DIGIPIN as a separate, much more precise location identifier and states that finding an exact DIGIPIN requires device GNSS/location capability.[3]

The current release therefore takes the safe path: PIN code for area-level synthetic sorting and optional browser geolocation for a temporary nearby-context signal. The next strong feature is a verified, timestamped service directory with approximate venue locations, not an exact “your address” claim. A future DIGIPIN integration should be treated as a separate privacy and technical workstream.

## Additional ideas that can differentiate the submission

A “safe handoff” receipt would let the pensioner see exactly what a family member helped with and what was not shared. A voice-guided family handoff would make the cross-window assistance more inclusive. A “why this failed” explainer could turn fingerprint failure into a calm decision tree instead of an error message. A small accessibility scorecard, written in plain language, could show the judges that font size, contrast, language, read-aloud, offline behavior, and human assistance were designed together. A service-operator dashboard showing anonymized synthetic bottlenecks could demonstrate how the same product might improve assisted-service delivery without exposing personal records.

## Submission narrative

The clearest story is: **“When one digital path fails, Sahara Pramaan keeps the person moving.”** Start with a user in a familiar Indian service context, show a forced fingerprint mismatch, offer liveness, family assistance, and an assisted-location route, then demonstrate language, read-aloud stop, dark mode, offline messaging, and a safe handoff. Close by stating what is synthetic and what would be required before production launch.

## References

[1]: https://developers.google.com/identity/sign-in/web/sign-in "Google Sign-In web documentation"
[2]: https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/authentication-templates/authentication-templates "Meta WhatsApp authentication templates"
[3]: https://www.indiapost.gov.in/digipin "India Post DIGIPIN"
