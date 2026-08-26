# Integration Status

## Supabase

The connected Supabase project `ehwwpesbwvohrazllutu` is active. It contains only the synthetic Sahara Pramaan prototype schema: `sp_pensioner_state`, `sp_family_assist_links`, and `sp_reminder_preferences`. The two deployed edge functions are `sahara-pramaan-prototype` and `sahara-pramaan-family-assist`. A command-line smoke test confirmed synthetic login, family-link creation, family-link lookup, and family-assist completion against the connected project.

## GitHub

The public repository is available at [apranav1711-byte/sahara-pramaan](https://github.com/apranav1711-byte/sahara-pramaan). The connected browser committed the latest source translation update directly to `main` as [`9e2d178`](https://github.com/apranav1711-byte/sahara-pramaan/commit/9e2d1789e5a241b903ffca02d89de42368167fd7), **Translate reminder save notification**, on 26 August 2026. The shell-managed project checkpoint remote remains separate from this public GitHub remote, so post-checkpoint documentation reconciliation must be performed deliberately rather than assumed to publish automatically.

The repository also retains `sahara-pramaan-source.zip` from commit `4aabc9a`. That archive is a source backup excluding dependencies, generated builds, logs, Git metadata, and environment files. It is not a substitute for keeping the unpacked public branch current.

## Deployment

The public Vercel project is **sahara-pramaan** under **Pranav aggarwal's projects**. Commit `9e2d178` deployed successfully as the Ready production build at [`https://sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app`](https://sahara-pramaan-1aqjtuf4w-pranav-aggarwals-projects-c0ba8f4d.vercel.app), with the public alias [`https://sahara-pramaan.vercel.app`](https://sahara-pramaan.vercel.app). The deployment uses the self-contained catch-all tRPC function and scoped rewrite already present in the repository; synthetic login through the production API was checked during the repair sequence.

No Vercel environment variable was invented or configured for this synthetic prototype. Its connected Supabase layer exposes only whitelisted synthetic edge-function operations and deliberately contains no real identity, pension, financial, biometric, government, messaging, or location integration.
