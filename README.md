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
npm ci
npm run dev      # http://localhost:3000
npm test         # evidence and GitHub tracker regressions
npm run build    # production build (ISR page, revalidated hourly)
```

## Reporting a vulnerability

Never as a public issue — see the [security policy](https://github.com/forceCalendar/.github/blob/main/SECURITY.md).

## License

[MIT](LICENSE)

## Dated evidence

The 2 October 2026 refresh is stored in [`public/evidence/2026-10-02.json`](public/evidence/2026-10-02.json) and served at `/evidence/2026-10-02.json`. It records exact versions, tested source commits, distinct npm `gitHead` values, integrity hashes, attestation endpoints, dependency-audit summaries, warnings and limitations. Do not silently rewrite this date to make old results look current.

- Core 2.5.6: 25 integration files and declarations pass; lint has 4 warnings, no errors.
- Interface 1.9.0: 291 tests and declarations pass, including a repeat with published core 2.5.6; 84.08% line coverage in the coverage run; lint has 12 warnings, no errors.
- React / Vue 0.3.1: actual npm tarball runtime tests (37 / 33) and Bundler / NodeNext declarations pass. Peer requirements and consumer checks are recorded separately from ordinary runtime dependencies.
- All four development-lockfile `npm audit --json` scans report zero known advisories. This does not measure code vulnerabilities or live Dependabot alerts.
- Core/interface `npm audit signatures` checks verify their installed dependency trees, not a new independent assessment of all release attestations.
- This audit website's original lockfile had 7 vulnerable dependencies (1 critical, 4 high, 1 moderate, 1 low). Compatible Next 16.3.8 / PostCSS 8.5.28 and targeted transitive updates clear the fresh known-advisory scan. No force fix or major framework migration was used.

### Reproduction and scope

Use the exact tested commits in the evidence with Node 24.19.0 and npm 11.9.0. Run `npm ci`, `npm audit --json` and each package's `npm test`; for core run `npm run quality`, and for interface run its build, build check, lint and coverage scripts. The interface compatibility repeat explicitly installs published core 2.5.6 rather than the older core pinned in its original development lockfile. Adapter tarball verification does not rebuild the extracted `dist` files. The source suite's build step and release tarball check are different checks.

Known-advisory results change over time. Registry metadata, source tests, installed-tree signature checks and browser/CSP testing are distinct evidence. This refresh did not run Snyk, query Dependabot alert counts, perform a new line-by-line security review, or repeat Salesforce/browser CSP validation. Private/unpublished code is not included in the public evidence. Performance data lives on the benchmark site and test durations are not used as benchmarks.

The live issue tracker follows all pagination for its documented label queries, excludes pull requests, preserves different issue numbers with matching titles, and never counts a not-planned closure as a fix. Failed queries are shown explicitly. A complete fetch still covers only public issues bearing the configured labels.
