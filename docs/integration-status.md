# Integration Status

## Supabase

The connected Supabase project `ehwwpesbwvohrazllutu` is active. It contains only the synthetic Sahara Pramaan service schema: `sp_pensioner_state`, `sp_family_assist_links`, and `sp_reminder_preferences`. The `sp_family_assist_links` table now also stores `attempt_count` and `last_attempt_at`, with attempts bounded from 0 through 5 by the applied migration `add_family_assist_attempt_limits`. The source for the two deployed Edge Functions is versioned under `supabase/functions/`. The live functions `sahara-pramaan-prototype` and `sahara-pramaan-family-assist` are both active at version 3. Synthetic family links expire after 24 hours and incorrect answers are bounded to five attempts. A command-line smoke test confirmed synthetic reminder write/readback through the pensioner operation, and the test state was reset afterward. The pensioner response includes the persisted `sms_enabled`, `voice_enabled`, and `family_enabled` values so the UI can hydrate saved mock preferences instead of reverting to defaults.

## GitHub

The public repository is available at [apranav1711-byte/sahara-pramaan](https://github.com/apranav1711-byte/sahara-pramaan). The current productization work is source-controlled on `main` through the implementation commits [`81aba6e`](https://github.com/apranav1711-byte/sahara-pramaan/commit/81aba6e79cb368116f6cd72d54d873403e31f829), [`597fc49`](https://github.com/apranav1711-byte/sahara-pramaan/commit/597fc494cd68e41dfa6f74d27057e2d816c152d7), and the current unpushed working tree changes. The shell-managed project checkpoint remote remains separate from this public GitHub remote, so post-checkpoint documentation reconciliation must be performed deliberately rather than assumed to publish automatically.

The repository also retains `sahara-pramaan-source.zip` from commit `4aabc9a`. That archive is a source backup excluding dependencies, generated builds, logs, Git metadata, and environment files. It is not a substitute for keeping the unpacked public branch current.

## Deployment

The public Vercel project is **sahara-pramaan** under **Pranav aggarwal's projects**. The connected `main` branch deploys automatically to the production alias [`https://sahara-pramaan.vercel.app`](https://sahara-pramaan.vercel.app). The deployment uses the self-contained catch-all tRPC function and scoped rewrite; `build:vercel` now overwrites the exact `api/[...path].js` target. The updated build includes PWA assets, guided accessibility controls, and the hardened server adapter.

No Vercel environment variable was invented or configured for this synthetic prototype. Its connected Supabase layer exposes only whitelisted synthetic Edge Function operations and deliberately contains no real identity, pension, financial, biometric, government, messaging, or location integration. The functions remain intentionally public for the recording flow (`verify_jwt: false`); this is documented as a synthetic service-concept choice and is not suitable for production identity assurance.
