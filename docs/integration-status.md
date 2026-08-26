# Integration Status

## Supabase

The connected Supabase project `ehwwpesbwvohrazllutu` is active. It contains only the synthetic Sahara Pramaan prototype schema: `sp_pensioner_state`, `sp_family_assist_links`, and `sp_reminder_preferences`. The source for the two deployed Edge Functions is now versioned under `supabase/functions/`. The live functions `sahara-pramaan-prototype` and `sahara-pramaan-family-assist` are both active at version 2. A command-line smoke test confirmed synthetic reminder write/readback through the pensioner operation, and the test state was reset afterward. The pensioner response now includes the persisted `sms_enabled`, `voice_enabled`, and `family_enabled` values so the UI can hydrate saved mock preferences instead of reverting to defaults.

## GitHub

The public repository is available at [apranav1711-byte/sahara-pramaan](https://github.com/apranav1711-byte/sahara-pramaan). The connected browser committed the latest source translation update directly to `main` as [`9e2d178`](https://github.com/apranav1711-byte/sahara-pramaan/commit/9e2d1789e5a241b903ffca02d89de42368167fd7), **Translate reminder save notification**, on 26 August 2026. The shell-managed project checkpoint remote remains separate from this public GitHub remote, so post-checkpoint documentation reconciliation must be performed deliberately rather than assumed to publish automatically.

The repository also retains `sahara-pramaan-source.zip` from commit `4aabc9a`. That archive is a source backup excluding dependencies, generated builds, logs, Git metadata, and environment files. It is not a substitute for keeping the unpacked public branch current.

## Deployment

The public Vercel project is **sahara-pramaan** under **Pranav aggarwal's projects**. Commit `9e2d178` deployed successfully as the Ready production build at [`https://sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app`](https://sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app), with the public alias [`https://sahara-pramaan.vercel.app`](https://sahara-pramaan.vercel.app). The deployment uses the self-contained catch-all tRPC function and scoped rewrite already present in the repository; synthetic login through the production API was checked during the repair sequence.

No Vercel environment variable was invented or configured for this synthetic prototype. Its connected Supabase layer exposes only whitelisted synthetic Edge Function operations and deliberately contains no real identity, pension, financial, biometric, government, messaging, or location integration. The functions remain intentionally public for the recording flow (`verify_jwt: false`); this is documented as a prototype-only choice and is not suitable for production identity assurance.
