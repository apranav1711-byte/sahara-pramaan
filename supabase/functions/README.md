# Sahara Pramaan Supabase Functions

These two Edge Functions provide the synthetic persistence layer for the public Sahara Pramaan service concept:

| Function | Responsibility |
| --- | --- |
| `sahara-pramaan-prototype` | Synthetic login, pensioner state, fingerprint/liveness outcomes, family-link creation, mock reminders, camp data, and reset. |
| `sahara-pramaan-family-assist` | Synthetic family-link read and shared-memory answer verification. |

The functions use the Supabase service role only inside the Edge Runtime to access the three RLS-protected synthetic tables. They contain no government, identity, biometric, financial, messaging, or real pension integrations.

`verify_jwt` is intentionally disabled for these functions because the public recording flow must be able to open a family-assist link without a Supabase account. Synthetic family links now expire after 24 hours and reject answers after five incorrect attempts; these controls are demo-safety boundaries, not identity assurance. A production implementation must replace this arrangement with audited authorization, expiring signed links, rate limits, abuse monitoring, and a real consent and identity-assurance design.

The repository copies the exact source deployed to the linked Supabase project so that the backend can be reviewed and reproduced. After changing a function, deploy it through the project’s Supabase management workflow, then run the public smoke tests and update `docs/integration-status.md` with the live function version and verification result.
