# 360px Mobile QA Record

The public landing page was reviewed at a **360 × 800 px** viewport after the final development-server restart. The following observations are based on the captured rendered page.

| Review area | Finding | Outcome |
| --- | --- | --- |
| Horizontal overflow | No content is clipped at either edge. The header, hero, certificate preview, footer disclosure, and bottom link remain inside the viewport. | **Pass** — no responsive correction required. |
| Primary touch targets | The full-width “Begin securely” and “View demo accounts” controls remain visibly tall and separated, with ample tap area. | **Pass** — primary actions remain comfortable for mobile use. |
| Navigation control | The header menu remains fully visible at the right edge and is not crowded by the brand lockup. | **Pass** — navigation control is reachable and legible. |
| Content-card readability | Alternative-path cards fit as a three-card row; labels may wrap to two lines but remain clear. The certificate-preview card scales beneath the actions without overlap. | **Pass** — no layout collision or unreadable label observed. |

No 360px-specific layout or touch-target defect was found in this review. A second 360px capture after restart matched these findings.
