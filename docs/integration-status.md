# Integration Status

## Supabase

The connected Supabase project `ehwwpesbwvohrazllutu` is active. It contains only the synthetic Sahara Pramaan prototype schema: `sp_pensioner_state`, `sp_family_assist_links`, and `sp_reminder_preferences`. The two deployed edge functions are `sahara-pramaan-prototype` and `sahara-pramaan-family-assist`. A command-line smoke test confirmed synthetic login, family-link creation, family-link lookup, and family-assist completion against the connected project.

## GitHub

The public repository is available at [apranav1711-byte/sahara-pramaan](https://github.com/apranav1711-byte/sahara-pramaan). The sandbox command-line token can create neither repositories nor pushes to this account, even though the browser session is authorized. The local project repository is connected to this URL and includes a committed implementation. Export or push the current checkpoint through the project’s GitHub management panel after the final checkpoint is saved.

On 26 August 2026, the public repository received `sahara-pramaan-source.zip` in commit `4aabc9a`. This 273 KB backup includes the project source while excluding dependencies, generated builds, logs, Git metadata, and environment files. The managed workspace checkpoint transport rewrites terminal Git remotes, so it still cannot publish the repository as an unpacked branch from this environment; the project management GitHub export remains the correct path for a raw-source repository mirror.

## Deployment

The application is designed for the managed deployment workflow. The user requested Vercel, but public publishing must be initiated from the project management interface after the final checkpoint; the public GitHub repository can then be used as an external source mirror if desired.

The connected Vercel context has one Hobby team, **Pranav aggarwal's projects** (`team_1Fn5H51wGt5eTQCl94bF2SsQ`), with no linked Git projects at the time of inspection. No Vercel project or deployment was created by this workflow. Once the checkpoint is exported to the public GitHub repository, the repository can be linked to that team from Vercel for a preview or production deployment.
