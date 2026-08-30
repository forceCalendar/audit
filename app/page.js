import Nav from '../components/Nav';
import Footer from '../components/Footer';
import RemediationTracker from '../components/RemediationTracker';
import { Section, SectionHeader, Eyebrow, Card, CardSection, StatRow, StatTile, Pill, Code, PlusList } from '../components/ui';
import { fetchSecurityFindings } from './lib/github';

// The tracker is fetched from GitHub on the server and the rendered page is
// regenerated at most once an hour (ISR), so it stays current without a
// redeploy. The hand-written content below is verified by hand on the date
// in LAST_VERIFIED.
export const revalidate = 3600;

const LAST_VERIFIED = '30 August 2026';

const VERSIONS = [
  { pkg: '@forcecalendar/core', version: '2.5.2' },
  { pkg: '@forcecalendar/interface', version: '1.7.0' },
  { pkg: '@forcecalendar/react', version: '0.3.0' },
  { pkg: '@forcecalendar/vue', version: '0.3.0' },
];

// status: 'compatible' | 'requires'. A "requires" row names the relaxation a
// host page must grant; it is never shown as compatible.
const cspDirectives = [
  {
    directive: "script-src 'self'",
    status: 'compatible',
    note: 'No eval(), no new Function(), no inline scripts, no remote code.',
  },
  {
    directive: "style-src 'self'",
    status: 'requires',
    requires: "'unsafe-inline'",
    note: 'The renderers set inline style attributes on cells and events, and the component injects a <style> element into its open shadow root. Every interpolated value passes through escapeHTML() / sanitizeColor(), but hashes and nonces are not supported yet, so under a strict style-src the browser drops the component\'s styles.',
  },
  { directive: "img-src 'self'", status: 'compatible', note: 'No dynamic image loading from external sources.' },
  { directive: "connect-src 'self'", status: 'compatible', note: 'ICS fetch respects connect-src (configurable).' },
  { directive: "object-src 'none'", status: 'compatible', note: 'No plugins, embeds, or applets.' },
  { directive: "base-uri 'self'", status: 'compatible', note: 'No base tag manipulation.' },
];

// Resolved attack-surface findings. Each entry links to the public issue.
const RESOLVED_FINDINGS = [
  {
    id: 'ics-parser',
    title: 'ICS Parser',
    component: '@forcecalendar/core',
    summary: 'The ICS parser processes external .ics files, which are untrusted input by definition. It previously lacked input size limits, which could allow denial of service via crafted files.',
    points: [
      'Fixed in v2.1.21: configurable size limits with safe defaults',
      'Maximum input size, line count, and event count enforced',
      'Parser is read-only; it cannot execute code or modify system state',
    ],
    issue: { url: 'https://github.com/forceCalendar/core/issues/37', label: 'core#37' },
    resolution: 'Resolved in v2.1.21',
  },
  {
    id: 'ssrf',
    title: 'URL Handling / SSRF',
    component: '@forcecalendar/core',
    summary: 'The ICS fetching mechanism previously accepted URLs pointing to internal network resources. In server-side contexts this created a Server-Side Request Forgery vector.',
    points: [
      'Fixed in v2.1.21: URL validation against private and internal IP ranges',
      'Scheme allowlisting restricts fetches to http and https',
      'Client-side usage is additionally mitigated by the browser same-origin policy',
    ],
    issue: { url: 'https://github.com/forceCalendar/core/issues/38', label: 'core#38' },
    resolution: 'Resolved in v2.1.21',
  },
  {
    id: 'dom-xss',
    title: 'DOM Rendering / XSS',
    component: '@forcecalendar/interface',
    summary: 'The Web Components interface layer renders event data into the DOM. Renderers previously inserted content via innerHTML without escaping, creating a cross-site scripting vector when event data contained untrusted input.',
    points: [
      'Fixed: all user-controlled values are escaped before template interpolation',
      'Hardened further in v1.0.60: parseHTML() sanitizes by default, stripping script-capable elements, inline handlers, and javascript: URLs',
      'The core library is entirely DOM-free and not affected',
    ],
    issue: { url: 'https://github.com/forceCalendar/interface/issues/39', label: 'interface#39' },
    resolution: 'Resolved February 2026; defense-in-depth added in v1.0.60',
  },
  {
    id: 'recurrence',
    title: 'Recurrence Engine',
    component: '@forcecalendar/core',
    summary: 'The recurrence expansion engine processes RFC 5545 RRULE patterns. It previously lacked hard limits on occurrence count, which could cause excessive computation via an algorithmic-complexity attack.',
    points: [
      'Fixed in v2.1.21: hard cap on maxOccurrences prevents unbounded expansion',
      'Expansion is CPU-bound only; no I/O or network side effects',
      'Can be further isolated in a Web Worker (already supported)',
    ],
    issue: { url: 'https://github.com/forceCalendar/core/issues/56', label: 'core#56' },
    resolution: 'Resolved in v2.1.21',
  },
  {
    id: 'redos',
    title: 'ReDoS in Email Validation',
    component: '@forcecalendar/core',
    summary: 'The email validation regex used for organizer and attendee fields was vulnerable to Regular Expression Denial of Service. Crafted input could cause catastrophic backtracking and block the main thread.',
    points: [
      'Fixed in v2.1.22: replaced the vulnerable regex with linear-time validation',
      'The new check has O(n) worst-case complexity',
      'Affects ICS parsing of ORGANIZER and ATTENDEE fields with mailto: URIs',
    ],
    issue: { url: 'https://github.com/forceCalendar/core/issues/111', label: 'core#111' },
    resolution: 'Resolved in v2.1.22',
  },
  {
    id: 'workflow-permissions',
    title: 'CI/CD Workflow Permissions',
    component: '@forcecalendar/core',
    summary: 'GitHub Actions workflows were using default (write-all) permissions, granting more access than necessary. Overly permissive workflows can be exploited if a dependency or action is compromised.',
    points: [
      'Fixed: explicit least-privilege permissions blocks on all workflows',
      'Read-only default with scoped write access only where required',
      "Follows GitHub's recommended security hardening for Actions",
    ],
    issue: { url: 'https://github.com/forceCalendar/core/issues/112', label: 'core#112' },
    resolution: 'Resolved',
  },
];

// Findings that are fixed or in progress but not yet published with an issue
// link. Rendered in the Attack Surface list ahead of the resolved entries;
// renders nothing while empty. Shape matches RESOLVED_FINDINGS plus `status`:
//   {
//     id: 'monthly-byday-loop',
//     title: '...',
//     component: '@forcecalendar/core',
//     summary: '...',
//     points: ['...'],
//     issue: { url: 'https://github.com/forceCalendar/core/issues/NNN', label: 'core#NNN' },
//     resolution: 'Fixed in vX.Y.Z',
//     status: 'Resolved' | 'In Progress' | 'Open',
//   }
const PENDING_FINDINGS = [];

const statusTone = { Resolved: 'ok', 'In Progress': 'warn', Open: 'bad' };

function Finding({ f }) {
  const status = f.status || 'Resolved';
  return (
    <article className="bg-raised p-5 sm:p-6">
      <div className="mb-2.5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium text-fg">{f.title}</h3>
          <span className="font-mono text-xs text-subtle">{f.component}</span>
        </div>
        <Pill tone={statusTone[status] || 'neutral'}>{status}</Pill>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-muted">{f.summary}</p>
      <PlusList items={f.points} />
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <a href={f.issue.url} className="link-quiet font-mono">{f.issue.label}</a>
        <span className={status === 'Resolved' ? 'text-ok' : 'text-muted'}>{f.resolution}</span>
      </div>
    </article>
  );
}

const criticalBugs = [
  { n: 107, url: 'https://github.com/forceCalendar/core/issues/107', bug: 'TimezoneManager.parseTimezone() property name mismatch', impact: 'Timezone abbreviations (e.g. PST, EST) could fail to resolve' },
  { n: 108, url: 'https://github.com/forceCalendar/core/issues/108', bug: 'ICSParser VALARM export uses wrong property name', impact: 'Alarm/reminder data lost during ICS round-trip export' },
  { n: 109, url: 'https://github.com/forceCalendar/core/issues/109', bug: 'DateUtils.isDST() returns inverted boolean', impact: 'DST detection inverted, causing incorrect time offsets' },
  { n: 110, url: 'https://github.com/forceCalendar/core/issues/110', bug: 'DateUtils.addHoursWithDST() double-adjusts offset', impact: 'Events shifted by double the DST offset during transitions' },
];

function HardeningBlock({ pkg, range, items }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="font-mono text-sm font-medium text-fg">{pkg}</span>
        <span className="font-mono text-xs text-subtle">{range}</span>
      </div>
      <PlusList items={items} />
    </div>
  );
}

export default async function Home() {
  const { findings, fetchedAt, failedQueries, totalQueries } = await fetchSecurityFindings();

  const attackSurface = [...PENDING_FINDINGS, ...RESOLVED_FINDINGS];

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Page header */}
      <header className="relative overflow-hidden border-b border-hairline">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-14 sm:pt-16 lg:pb-14 lg:pt-20">
          <div className="max-w-3xl">
            <div className="mb-5 animate-fade-up">
              <Eyebrow pill>Security transparency</Eyebrow>
            </div>
            <h1 className="font-display text-display-lg text-fg animate-fade-up [animation-delay:60ms] sm:text-display-xl">
              Security Audit
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted animate-fade-up [animation-delay:120ms] sm:text-xl">
              A running self-assessment of forceCalendar&apos;s published packages: what ships, what they need from
              your Content Security Policy, what has gone wrong, and what was done about it.
            </p>
            <dl className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-subtle animate-fade-up [animation-delay:180ms]">
              <div className="flex items-center gap-1.5">
                <dt>Last verified</dt>
                <dd className="font-medium text-fg tabular">{LAST_VERIFIED}</dd>
              </div>
              {VERSIONS.map((v) => (
                <div key={v.pkg} className="flex items-center gap-1.5 font-mono">
                  <dt className="text-subtle">{v.pkg.replace('@forcecalendar/', '')}</dt>
                  <dd className="text-fg">{v.version}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Card tone="sunken" padding="sm" className="mt-8 max-w-3xl animate-fade-up [animation-delay:240ms]">
            <p className="text-sm leading-relaxed text-muted">
              This is not a marketing page. It documents real findings, including open vulnerabilities and their
              remediation status, and states plainly where the library needs a relaxed policy. Transparency builds
              more trust than a clean report that hides issues.
            </p>
          </Card>
        </div>
      </header>

      {/* Supply chain */}
      <Section id="supply-chain">
        <SectionHeader
          eyebrow="Supply chain"
          title="What actually ships"
          subtitle="Runtime dependency counts and publish provenance for the packages on npm, verified against the registry."
        />

        <StatRow columns={4}>
          <StatTile value="0" label="Runtime deps · core" tone="ok" />
          <StatTile value="0" label="Runtime deps · interface" tone="ok" />
          <StatTile value="4 / 4" label="Packages with provenance" tone="ok" />
          <StatTile value="0" label="Open Dependabot alerts" tone="ok" />
        </StatRow>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card padding="none">
            <CardSection>
              <h3 className="mb-2 text-[15px] font-medium text-fg">Zero runtime dependencies</h3>
              <p className="text-sm leading-relaxed text-muted">
                Every dependency is a potential attack vector; the <Code>event-stream</Code>, <Code>ua-parser-js</Code> and{' '}
                <Code>colors</Code> incidents showed that even popular packages get compromised. <Code>@forcecalendar/core</Code>{' '}
                and <Code>@forcecalendar/interface</Code> list no <Code>dependencies</Code> at all, so there is no transitive
                tree to monitor and nothing for <Code>npm audit</Code> to flag in the published packages.
              </p>
            </CardSection>
            <CardSection tone="sunken">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ok">forceCalendar</div>
                  <PlusList items={['Zero runtime dependencies', 'No transitive dependency tree', 'No supply chain attack surface', 'Adapters (react, vue): peer dependencies only']} />
                </div>
                <div>
                  <div className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Typical calendar library</div>
                  <ul className="space-y-1.5 text-sm text-muted">
                    {['30-100+ transitive dependencies', 'Each dependency is an attack vector', 'Vulnerability churn from updates', 'Requires continuous monitoring'].map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <span className="mt-[3px] h-3.5 w-3.5 shrink-0 rounded-full bg-sunken text-center font-mono text-[10px] leading-[14px] text-subtle ring-1 ring-inset ring-hairline" aria-hidden>-</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardSection>
            <CardSection>
              <p className="text-xs leading-relaxed text-subtle">
                Verified by running <Code>npm ls --all --json</Code> on <Code>@forcecalendar/core</Code> 2.5.2 and{' '}
                <Code>@forcecalendar/interface</Code> 1.7.0. <Code>@forcecalendar/react</Code> and <Code>@forcecalendar/vue</Code> 0.3.0
                also ship zero runtime dependencies and declare their framework as a peer dependency.
              </p>
            </CardSection>
          </Card>

          <Card padding="none">
            <CardSection>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-[15px] font-medium text-fg">Signed build provenance</h3>
                <Pill tone="ok">SLSA v1</Pill>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                All four packages are published from GitHub Actions with OIDC trusted publishing and{' '}
                <Code>npm publish --provenance</Code>. Each release carries a SLSA provenance attestation
                (<Code>https://slsa.dev/provenance/v1</Code>) that ties the tarball on npm to the exact
                workflow run and commit that produced it. <Code>core</Code> and <Code>interface</Code> are
                additionally published to GitHub Packages.
              </p>
            </CardSection>
            <CardSection tone="sunken">
              <div className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Verify it yourself</div>
              <pre className="overflow-x-auto rounded-md bg-code-bg p-3.5 font-mono text-[12.5px] leading-relaxed text-code-fg ring-1 ring-code-border">
                <span className="text-code-muted">$ </span>npm view @forcecalendar/core dist.attestations{'\n'}
                <span className="text-code-muted">$ </span>npm audit signatures
              </pre>
              <p className="mt-2.5 text-xs leading-relaxed text-subtle">
                The first prints the attestation URL and provenance predicate type; the second checks the registry
                signatures and attestations of everything in your lockfile. Substitute <Code>interface</Code>,{' '}
                <Code>react</Code> or <Code>vue</Code> for <Code>core</Code>.
              </p>
            </CardSection>
          </Card>
        </div>

        <Card className="mt-6" padding="none">
          <CardSection>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[15px] font-medium text-fg">Dev dependency hygiene</h3>
              <span className="text-xs text-subtle">as of {LAST_VERIFIED}, from GitHub Dependabot</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              While the published packages ship zero runtime dependencies, development tooling (testing, bundling,
              linting) does use dev dependencies, and Dependabot monitors those. Today there are{' '}
              <strong className="font-medium text-fg">0 open alerts on core and 0 on interface</strong>. On {LAST_VERIFIED} the
              dev-dependency trees of core, interface and vue were updated to clear the outstanding{' '}
              <Code>npm audit</Code> high-severity advisories (<Code>brace-expansion</Code>, <Code>js-yaml</Code>,{' '}
              <Code>nanoid</Code>, <Code>postcss</Code>). Through July 2026, 82 Dependabot alerts had been resolved on core;
              none of them affected a published package or runtime behaviour.
            </p>
          </CardSection>
        </Card>
      </Section>

      {/* CSP */}
      <Section id="csp" divider>
        <SectionHeader
          eyebrow="Content Security Policy"
          title="What the library needs from your CSP"
          subtitle="Script execution is fully CSP-clean. Styling needs one relaxation, stated below rather than glossed over."
        />

        <Card padding="none" className="overflow-hidden">
          {/* Phones: one stacked entry per directive; wider screens: the table */}
          <div className="divide-y divide-hairline sm:hidden">
            {cspDirectives.map((row) => (
              <div key={row.directive} className="p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-fg">{row.directive}</span>
                  {row.status === 'compatible' ? <Pill tone="ok">Compatible</Pill> : <Pill tone="warn">Requires {row.requires}</Pill>}
                </div>
                <p className="text-sm leading-relaxed text-muted">{row.note}</p>
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto sm:block">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Directive</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {cspDirectives.map((row) => (
                  <tr key={row.directive}>
                    <td className="whitespace-nowrap font-mono text-xs text-fg">{row.directive}</td>
                    <td className="whitespace-nowrap">
                      {row.status === 'compatible' ? (
                        <Pill tone="ok">Compatible</Pill>
                      ) : (
                        <Pill tone="warn">Requires {row.requires}</Pill>
                      )}
                    </td>
                    <td className="min-w-[20rem] text-sm text-muted">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CardSection tone="sunken">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <h3 className="mb-1.5 text-[15px] font-medium text-fg">Minimum policy for @forcecalendar/interface 1.7.0</h3>
                <pre className="overflow-x-auto rounded-md bg-code-bg p-3.5 font-mono text-[12.5px] leading-relaxed text-code-fg ring-1 ring-code-border">
                  script-src &apos;self&apos;;{'\n'}style-src &apos;self&apos; &apos;unsafe-inline&apos;;
                </pre>
                <p className="mt-2.5 text-xs leading-relaxed text-subtle">
                  Inline <Code>style</Code> attributes and the shadow-root stylesheet are what need{' '}
                  <Code>&apos;unsafe-inline&apos;</Code>. The values written into them are escaped and colour-sanitised, so the
                  relaxation does not open a script path, but it is a relaxation and it is listed as one. Hash- or nonce-based
                  styling is not supported yet. <Code>@forcecalendar/core</Code> is DOM-free and imposes no CSP requirement.
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="mb-1.5 text-[15px] font-medium text-fg">Prohibited patterns</h3>
                <p className="mb-2.5 text-xs leading-relaxed text-subtle">Explicitly avoided throughout the codebase:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['eval()', 'new Function()', 'document.write()', 'innerHTML *'].map((pattern) => (
                    <div key={pattern} className="rounded-md bg-raised px-3 py-2 text-center ring-1 ring-inset ring-hairline">
                      <span className="font-mono text-xs text-bad line-through decoration-bad/60">{pattern}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-subtle">
                  * innerHTML is used in <Code>@forcecalendar/interface</Code> renderers with all user-controlled values escaped before
                  interpolation (finding DOM-001, resolved). The core library is entirely DOM-free.
                </p>
              </div>
            </div>
          </CardSection>

          <CardSection>
            <p className="text-xs leading-relaxed text-subtle">
              Salesforce Locker Service compatibility has been verified in production deployments. The library runs in
              Lightning Web Components without CSP violations.
            </p>
          </CardSection>
        </Card>
      </Section>

      {/* Attack surface */}
      <Section id="attack-surface" divider>
        <SectionHeader
          eyebrow="Attack surface"
          title="Where a calendar library can be attacked"
          subtitle="A calendar library has a specific and bounded attack surface. Each vector below is one that has actually been reported against forceCalendar, with what was done."
          aside={
            <div className="flex flex-wrap gap-2 text-xs">
              <Pill tone="ok">{RESOLVED_FINDINGS.length + PENDING_FINDINGS.filter((f) => (f.status || 'Resolved') === 'Resolved').length} resolved</Pill>
              {PENDING_FINDINGS.some((f) => f.status && f.status !== 'Resolved') && (
                <Pill tone="warn">{PENDING_FINDINGS.filter((f) => f.status && f.status !== 'Resolved').length} in progress</Pill>
              )}
            </div>
          }
        />

        <Card padding="none" className="overflow-hidden">
          {/* gap-px over the hairline colour draws dividers correctly however the grid wraps */}
          <div className="grid gap-px bg-hairline lg:grid-cols-2">
            {attackSurface.map((f) => (
              <Finding key={f.id} f={f} />
            ))}
          </div>
        </Card>
      </Section>

      {/* Hardening */}
      <Section id="hardening" divider>
        <SectionHeader
          eyebrow="Hardening"
          title="Ongoing hardening"
          subtitle="Security and stability work between reported findings, newest first."
        />

        <div className="space-y-6">
          <Card padding="none">
            <CardSection>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[15px] font-medium text-fg">August 2026</h3>
                <span className="font-mono text-xs text-subtle">core 2.5.1 – 2.5.2 · interface 1.6.0 – 1.7.0</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A CI/CD fix in both publish pipelines, CPU-exhaustion mitigations in the recurrence engine, and a clean
                sweep of the dev-dependency advisories.
              </p>
            </CardSection>
            <CardSection tone="sunken">
              <div className="grid gap-6 lg:grid-cols-2">
                <HardeningBlock
                  pkg="core · interface"
                  range="publish workflows"
                  items={[
                    'Command-injection fix: the release step interpolated the commit message directly into a shell script; it is now passed through an environment variable',
                    'Both workflows publish with npm provenance; the release-banner step authenticates with a bearer-token secret',
                    'Dev-dependency trees updated to clear the brace-expansion, js-yaml, nanoid and postcss advisories',
                  ]}
                />
                <HardeningBlock
                  pkg="@forcecalendar/core"
                  range="2.5.1 – 2.5.2"
                  items={[
                    'Bounded recurrence expansion: a hard iteration limit (MAX_ITERATIONS_HARD_LIMIT) caps every expansion loop',
                    'Incremental timezone-transition caches: a far-past DTSTART no longer triggers multi-second rescans (CPU DoS mitigation)',
                    'Recurrence rule objects are no longer mutated during expansion',
                    'Occurrence-id resolution is consistent across APIs; hourCycle fix for older ICU builds',
                  ]}
                />
              </div>
            </CardSection>
          </Card>

          <Card padding="none">
            <CardSection>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[15px] font-medium text-fg">Continued hardening (2026)</h3>
                <span className="font-mono text-xs text-subtle">core 2.1.63 – 2.1.68 · interface 1.0.60</span>
              </div>
            </CardSection>
            <CardSection tone="sunken">
              <div className="grid gap-6 lg:grid-cols-2">
                <HardeningBlock
                  pkg="@forcecalendar/core"
                  range="2.1.63 – 2.1.68"
                  items={[
                    'Hardened ICS import and timezone parsing against malformed input',
                    'Stabilized search worker indexing, event overlap indexing, and recurring event expansion',
                  ]}
                />
                <HardeningBlock
                  pkg="@forcecalendar/interface"
                  range="1.0.60"
                  items={[
                    'parseHTML() now sanitizes by default: strips script-capable elements, inline event handlers, and javascript: URLs',
                    'Focus trapping fixed inside Shadow DOM; animation waits can no longer hang callers',
                    'Defensive escaping of colour labels and values in the event form',
                  ]}
                />
              </div>
            </CardSection>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <CardSection>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[15px] font-medium text-fg">Critical bug fixes</h3>
                <span className="font-mono text-xs text-subtle">core 2.1.22</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Not direct security vulnerabilities, but correctness bugs in date/time handling can lead to data-integrity
                issues in production calendar systems. All four shipped in PRs #113–#118 with regression tests.
              </p>
            </CardSection>
            <div className="overflow-x-auto border-t border-hairline">
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Issue</th>
                    <th>Bug</th>
                    <th>Impact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalBugs.map((b) => (
                    <tr key={b.n}>
                      <td className="whitespace-nowrap"><a href={b.url} className="font-mono text-xs text-muted transition-colors hover:text-accent-text">#{b.n}</a></td>
                      <td className="min-w-[15rem] text-sm text-fg">{b.bug}</td>
                      <td className="min-w-[16rem] text-sm text-muted">{b.impact}</td>
                      <td><Pill tone="ok">Resolved</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Section>

      {/* Remediation tracker */}
      <Section id="remediation" tone="sunken">
        <SectionHeader
          eyebrow="Remediation tracker"
          title="Every reported finding"
          subtitle="Pulled from GitHub Issues on the server and regenerated hourly. Counts are always shown in full; only the long tail of resolved rows is folded."
        />
        <RemediationTracker findings={findings} fetchedAt={fetchedAt} failedQueries={failedQueries} totalQueries={totalQueries} />
      </Section>

      {/* Methodology */}
      <Section id="methodology">
        <SectionHeader eyebrow="Methodology" title="How this page is produced" />
        <Card padding="none" className="overflow-hidden">
          <div className="grid divide-y divide-hairline md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-5 sm:p-6">
              <h3 className="mb-3 text-[15px] font-medium text-fg">Audit approach</h3>
              <ol className="space-y-2.5 text-sm text-muted">
                {[
                  ['Manual code review', 'line-by-line analysis of core and interface, focusing on input handling, DOM manipulation, and data flow'],
                  ['Dependency analysis', <>verification of the zero-dependency claim via <Code>npm ls</Code> and package.json inspection, plus provenance attestations on the registry</>],
                  ['CSP compatibility testing', 'deployment and validation in Salesforce Locker Service and behind strict CSP headers'],
                  ['Attack surface mapping', 'identification of all input vectors, trust boundaries, and data flows'],
                ].map(([title, body], i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-px shrink-0 font-mono text-xs text-subtle tabular">{i + 1}.</span>
                    <span><strong className="font-medium text-fg">{title}</strong> — {body}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="mb-3 text-[15px] font-medium text-fg">Recommended tooling</h3>
              <PlusList
                className="space-y-2.5"
                items={[
                  <><Code>npm audit</Code> and <Code>npm audit signatures</Code> — known vulnerabilities and registry signatures / attestations</>,
                  <><Code>eslint-plugin-security</Code> — static analysis for common security anti-patterns in JavaScript</>,
                  <><strong className="font-medium text-fg">Snyk</strong> — continuous vulnerability monitoring and code analysis</>,
                  <><strong className="font-medium text-fg">GitHub Dependabot</strong> — automated dependency updates (minimal surface for forceCalendar due to zero runtime deps)</>,
                ]}
              />
            </div>
          </div>
          <CardSection tone="sunken">
            <h3 className="mb-2 text-[15px] font-medium text-fg">Scope and disclosure</h3>
            <p className="text-sm leading-relaxed text-muted">
              This audit covers <Code>@forcecalendar/core</Code> and <Code>@forcecalendar/interface</Code> as published on npm.
              The Salesforce LWC wrapper, documentation site, and benchmark tooling are out of scope. This is a
              self-assessment, not a third-party audit. We encourage independent security researchers to verify these
              findings. Vulnerabilities should be reported privately through GitHub as described in the{' '}
              <a href="https://github.com/forceCalendar/.github/blob/main/SECURITY.md" className="link">security policy</a>,
              never as a public issue.
            </p>
          </CardSection>
        </Card>
      </Section>

      <Footer />
    </div>
  );
}
