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

The current 4 October 2026 snapshot is [`public/evidence/2026-10-04.json`](public/evidence/2026-10-04.json), served at `/evidence/2026-10-04.json`. The [2 October snapshot](public/evidence/2026-10-02.json) is preserved unchanged as history. Never change the date to make old checks appear current.

- Published pair: **Core 2.5.7 / Interface 1.9.1**, with exact tested commits, registry gitHead values, SHA-512 integrity and SHA-256 tarball hashes.
- Core: 26/26 UTC integration files, including 696 cross-host recurrence fixtures, and declarations pass. All 22 published runtime JavaScript files match release source. Quality: 0 lint errors, 4 warnings, formatting passes. Fresh dependency signature check: 83 signatures / 17 attestations.
- Interface: 298/298 tests in 20 suites and declarations pass with actual core 2.5.7. Fresh line coverage: 84.08%. All 17 published source JavaScript files match release source. Build and formatting pass; lint has 0 errors / 12 warnings. Rebuilt dist bundles are not byte-identical to the published bundles, so source equivalence must not be described as build reproducibility. Fresh tree signature verification is incomplete; earlier counts remain in the archive.
- Published React/Vue 0.3.1 tarballs: React 19.3.0 and 18.3.1 each pass 37 tests; Vue 3.5.43 passes 33. Six Bundler/NodeNext declaration checks pass with TypeScript 5.9.3 and skipLibCheck false. All use published core 2.5.7/interface 1.9.1, with adapter dist and installed peer files unchanged from the tarballs.

### Current advisory findings

There is **one distinct high-severity braces advisory**, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affecting development/build dependency trees:

- Interface development lock: 29 affected npm package entries through Jest/micromatch; production-only scan: 0. These are not 29 distinct vulnerabilities. npm reports compatible dependency-tree fixes, but none were applied or validated in this refresh.
- Audit website: 5 affected npm package entries through Tailwind 3 tooling; production-only scan: 0. Registry metadata shows no patched braces release. npm suggests a Tailwind 4 major upgrade for most affected paths; no major migration was attempted.
- Core and original React/Vue repository lock scans: 0. Separate exact-peer compatibility fixtures and the clean production consumer also report 0.

This is a dated known-advisory scan, not a live Dependabot count or proof of vulnerability-free code. The earlier website seven-to-zero cleanup remains correctly recorded in the October 2 archive and is not reused as today's result.

### Reproduction and scope

Environment: Linux, Node 24.19.0, npm 11.9.0, TZ=UTC. Use the exact source commits in the evidence. Repository checks use `npm ci`, `npm audit --json`, package test/build/type/quality scripts and production-only `npm audit --omit=dev --json`. The Interface compatibility run overlays published core 2.5.7 rather than its older development-lock peer; its test fixture/toolchain is distinct from the original lockfile advisory scan. Adapter checks run extracted published dist and declarations without invoking scripts that rebuild them. The evidence records fixture lockfile hashes and exact framework/type compiler versions.

All six consumer ESM roots import under jsdom; bare Node imports pass for core and adapters. The raw interface requires a DOM (`HTMLElement`), and only the adapters export a `package.json` subpath. These are jsdom/SSR checks, not real-browser or Salesforce validation.

Core's October 2 full release-candidate suites passed 26/26 in UTC/Melbourne and 25/26 in Los Angeles/Kolkata due to legacy conversion failures. Those historical limitations remain; the October 4 refresh reran the unchanged release's UTC suite and recurrence matrix, not every full host suite. No blanket timezone-correctness claim is made.

No new penetration test, Snyk scan, Dependabot alert API query or Salesforce/library-CSP validation was performed. Private projects remain excluded. Benchmark measurements live on the benchmark site, and test durations are not benchmarks. No workflow or security configuration is changed by this refresh.

The live tracker paginates the documented label queries, excludes PRs, deduplicates by issue number and does not count not-planned closures as fixes. Failed queries remain visible; complete retrieval covers only public issues bearing those labels.
