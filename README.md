# forceCalendar Security Audit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

The public security transparency page for [forceCalendar](https://forcecalendar.org). This is **not a marketing page** — it shows the real security posture of the project, including open findings and their remediation status.

## What it shows

- **Supply chain** — runtime dependency count for `@forcecalendar/core` and `@forcecalendar/interface` (zero, and zero transitive)
- **CSP compatibility** — which strict Content-Security-Policy directives the library runs under
- **Live findings** — open and resolved issues fetched from GitHub at build/view time (issues labeled `type:security`, plus critical/high `type:bug` issues in `core` and `interface`)
- **Remediation tracker** — status of each finding

## Stack

Next.js (App Router, ISR) · React 19 · Tailwind CSS. The findings data comes from `app/lib/github.js`, which queries the GitHub Issues API on the server; the rendered page is regenerated at most once an hour, so the tracker follows GitHub without a redeploy — no manual editing of findings.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (ISR page, revalidated hourly)
```

## Reporting a vulnerability

Never as a public issue — see the [security policy](https://github.com/forceCalendar/.github/blob/main/SECURITY.md).

## License

[MIT](LICENSE)
