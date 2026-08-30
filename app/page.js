import Nav from '../components/Nav';
import Footer from '../components/Footer';
import RemediationTracker from '../components/RemediationTracker';
import { fetchSecurityFindings } from './lib/github';

const cspDirectives = [
  { directive: "script-src 'self'", compatible: true, note: 'No eval(), no new Function(), no inline scripts' },
  {
    directive: "style-src 'self'",
    compatible: false,
    requires: "'unsafe-inline'",
    note: "The renderers set inline style attributes on cells and events, and the component injects a <style> element into its open shadow root. Every interpolated value passes through escapeHTML() / sanitizeColor(), but hashes and nonces are not supported yet, so a page must allow style-src 'unsafe-inline'.",
  },
  { directive: "img-src 'self'", compatible: true, note: 'No dynamic image loading from external sources' },
  { directive: "connect-src 'self'", compatible: true, note: 'ICS fetch respects connect-src (configurable)' },
  { directive: "object-src 'none'", compatible: true, note: 'No plugins, embeds, or applets' },
  { directive: "base-uri 'self'", compatible: true, note: 'No base tag manipulation' },
];

// Findings that are fixed or in progress but not yet published with an issue
// link. Rendered at the top of the Attack Surface list; renders nothing while
// empty. Shape:
//   {
//     id: 'monthly-byday-loop',
//     title: '...',
//     component: '@forcecalendar/core',
//     summary: '...',
//     points: ['...'],
//     issue: { url: 'https://github.com/forceCalendar/core/issues/NNN', label: 'GitHub Issue #NNN' },
//     resolution: 'Fixed in vX.Y.Z',
//     status: 'Resolved' | 'In Progress' | 'Open',
//   }
const PENDING_FINDINGS = [];

const statusBadge = { Resolved: 'badge-green', 'In Progress': 'badge-yellow', Open: 'badge-red' };

export default async function Home() {
  const { findings, fetchedAt } = await fetchSecurityFindings();

  const resolvedCount = findings.filter(f => f.status === 'Resolved').length;
  const openCount = findings.filter(f => f.status !== 'Resolved').length;
  const fetchDate = new Date(fetchedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
            Security Audit
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Transparent security analysis of forceCalendar&apos;s codebase. Built for environments where security is non-negotiable.
          </p>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 font-mono">
            Last verified 30 August 2026 · core 2.5.2 · interface 1.7.0 · react 0.3.0 · vue 0.3.0
          </p>
          <div className="mt-8 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-left max-w-2xl mx-auto">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This is not a marketing page. This audit documents real findings, including open vulnerabilities
              and their remediation status, and states plainly where the library needs a relaxed policy. We believe
              transparency builds more trust than a clean report that hides issues.
            </p>
          </div>
        </div>
      </section>

      {/* Supply Chain Security */}
      <section id="supply-chain" className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8">
            Supply Chain Security
          </h2>
          <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 mb-6">
              <div className="px-6 py-4 text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">0</div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Dependencies</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">0</div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Transitive Deps</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">0</div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">npm Advisories</div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Why this matters</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Every dependency is a potential attack vector. Supply chain attacks (like the
                {' '}<span className="font-mono text-xs">event-stream</span>,{' '}
                <span className="font-mono text-xs">ua-parser-js</span>, and{' '}
                <span className="font-mono text-xs">colors</span> incidents) have demonstrated that
                even popular packages can be compromised. forceCalendar eliminates this entire
                class of vulnerability by shipping zero runtime dependencies.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400/80 mb-2">forceCalendar</div>
                  <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 shrink-0">+</span>
                      <span>Zero runtime dependencies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 shrink-0">+</span>
                      <span>No transitive dependency tree</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 shrink-0">+</span>
                      <span>No supply chain attack surface</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 shrink-0">+</span>
                      <span><span className="font-mono text-xs">npm audit</span> always clean</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Typical Calendar Library</div>
                  <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 dark:text-slate-600 shrink-0">--</span>
                      <span>30-100+ transitive dependencies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 dark:text-slate-600 shrink-0">--</span>
                      <span>Each dependency is an attack vector</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 dark:text-slate-600 shrink-0">--</span>
                      <span>Vulnerability churn from dep updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 dark:text-slate-600 shrink-0">--</span>
                      <span>Requires continuous monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Dev dependency hygiene</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                While forceCalendar ships zero runtime dependencies, development tooling (testing, bundling, linting)
                does use dev dependencies. Dependabot monitors these for known vulnerabilities.
              </p>
              <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 mb-4">
                <div className="px-4 py-3 text-center">
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">0</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Open Alerts (core)</div>
                </div>
                <div className="px-4 py-3 text-center">
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">0</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Open Alerts (interface)</div>
                </div>
                <div className="px-4 py-3 text-center">
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">4/4</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Packages with provenance</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                On 30 August 2026 the dev-dependency trees of core, interface and vue were updated to clear the
                outstanding <span className="font-mono text-xs">npm audit</span> high-severity advisories
                (<span className="font-mono text-xs">brace-expansion</span>, <span className="font-mono text-xs">js-yaml</span>,{' '}
                <span className="font-mono text-xs">nanoid</span>, <span className="font-mono text-xs">postcss</span>).
                Through July 2026, 82 Dependabot alerts had been resolved on core; none of them affected a published
                package or runtime behavior. Counts as of 30 August 2026, from GitHub Dependabot.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Signed build provenance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                All four packages (<span className="font-mono text-xs">core</span>, <span className="font-mono text-xs">interface</span>,{' '}
                <span className="font-mono text-xs">react</span>, <span className="font-mono text-xs">vue</span>) are published from GitHub
                Actions with OIDC trusted publishing and <span className="font-mono text-xs">npm publish --provenance</span>. Each release
                carries a SLSA provenance attestation (<span className="font-mono text-xs">https://slsa.dev/provenance/v1</span>) tying the
                tarball on npm to the workflow run and commit that produced it. core and interface are additionally published to GitHub Packages.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Verify: <span className="font-mono text-xs">npm view @forcecalendar/core dist.attestations</span> prints the attestation URL
                and provenance predicate type; <span className="font-mono text-xs">npm audit signatures</span> checks the registry signatures
                and attestations of everything in your lockfile.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Verified by running <span className="font-mono text-xs">npm ls --all --json</span> on{' '}
                <span className="font-mono text-xs">@forcecalendar/core</span> 2.5.2 and{' '}
                <span className="font-mono text-xs">@forcecalendar/interface</span> 1.7.0.
                Both packages list zero <span className="font-mono text-xs">dependencies</span> in their package.json.
                <span className="font-mono text-xs">@forcecalendar/react</span> and <span className="font-mono text-xs">@forcecalendar/vue</span> 0.3.0
                also ship zero runtime dependencies and declare their framework as a peer dependency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CSP Compliance */}
      <section id="csp" className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8">
            Content Security Policy Compliance
          </h2>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                forceCalendar was built specifically for strict CSP environments, including Salesforce Locker Service
                -- one of the most restrictive JavaScript sandboxes in production use. Script execution uses no
                pattern that a strict CSP forbids. Styling needs one relaxation, <span className="font-mono text-xs">style-src &apos;unsafe-inline&apos;</span>,
                which is stated in the table rather than glossed over. <span className="font-mono text-xs">@forcecalendar/core</span> is
                DOM-free and imposes no CSP requirement.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>CSP Directive</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cspDirectives.map((row, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs text-slate-700 dark:text-slate-300">{row.directive}</td>
                      <td className="whitespace-nowrap">
                        {row.compatible ? (
                          <span className="badge badge-green">Compatible</span>
                        ) : (
                          <span className="badge badge-yellow">Requires {row.requires}</span>
                        )}
                      </td>
                      <td className="text-sm text-slate-500 dark:text-slate-400">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Prohibited patterns</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                The following JavaScript patterns are explicitly avoided throughout the codebase:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['eval()', 'new Function()', 'document.write()', 'innerHTML *'].map((pattern) => (
                  <div key={pattern} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 text-center">
                    <span className="font-mono text-xs text-red-500 dark:text-red-400 line-through">{pattern}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                * innerHTML is used in <span className="font-mono text-xs">@forcecalendar/interface</span> renderers with
                all user-controlled values escaped before interpolation (finding DOM-001, resolved).
                The core library is entirely DOM-free.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Salesforce Locker Service compatibility has been verified in production deployments.
                The library runs in Lightning Web Components without any CSP violations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attack Surface Analysis */}
      <section id="attack-surface" className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8">
            Attack Surface Analysis
          </h2>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                A calendar library has a specific and bounded attack surface. The following analysis
                covers the primary vectors relevant to forceCalendar&apos;s architecture.
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {PENDING_FINDINGS.map((f) => (
                <div key={f.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white text-sm">{f.title}</h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{f.component}</span>
                    </div>
                    <span className={`badge ${statusBadge[f.status] || 'badge-slate'}`}>{f.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{f.summary}</p>
                  <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                    {f.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <a href={f.issue.url} className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                      {f.issue.label}
                    </a>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">-- {f.resolution}</span>
                  </div>
                </div>
              ))}

              {/* ICS Parser */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">ICS Parser</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-green">Resolved</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The ICS parser processes external <span className="font-mono text-xs">.ics</span> files, which are untrusted input by definition.
                  Previously lacked input size limits, which could allow denial-of-service via crafted files.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Fixed in v2.1.21 -- configurable size limits with safe defaults</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Maximum input size, line count, and event count enforcement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Parser is read-only -- cannot execute code or modify system state</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/core/issues/37" className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #37
                  </a>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">-- Resolved in v2.1.21</span>
                </div>
              </div>

              {/* URL Handling */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">URL Handling / SSRF</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-green">Resolved</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The ICS file fetching mechanism previously accepted URLs pointing to internal network resources.
                  In server-side contexts, this created a Server-Side Request Forgery (SSRF) vector.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Fixed in v2.1.21 -- URL validation against private/internal IP ranges</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Scheme allowlisting restricts to http/https only</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Client-side usage additionally mitigated by browser same-origin policy</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/core/issues/38" className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #38
                  </a>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">-- Resolved in v2.1.21</span>
                </div>
              </div>

              {/* DOM Rendering */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">DOM Rendering / XSS</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">@forcecalendar/interface</span>
                  </div>
                  <span className="badge badge-green">Resolved</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The Web Components interface layer renders event data into the DOM. Renderers previously
                  inserted content via <span className="font-mono text-xs">innerHTML</span> without escaping, creating a cross-site
                  scripting vector when event data contained untrusted input.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Fixed -- all user-controlled values are escaped before template interpolation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Hardened further in v1.0.60 -- <span className="font-mono text-xs">parseHTML()</span> sanitizes by default, stripping script-capable elements, inline handlers, and <span className="font-mono text-xs">javascript:</span> URLs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Core library is entirely DOM-free and not affected</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/interface/issues/39" className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #39
                  </a>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">-- Resolved February 2026; defense-in-depth added in v1.0.60</span>
                </div>
              </div>

              {/* Recurrence Engine */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">Recurrence Engine</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-green">Resolved</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The recurrence expansion engine processes RFC 5545 RRULE patterns. Previously lacked hard limits
                  on occurrence count, which could cause excessive computation via algorithmic complexity attack.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Fixed in v2.1.21 -- hard cap on maxOccurrences prevents unbounded expansion</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Expansion is CPU-bound only -- no I/O or network side effects</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Can be further mitigated with Web Worker isolation (already supported)</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/core/issues/56" className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #56
                  </a>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">-- Resolved in v2.1.21</span>
                </div>
              </div>

              {/* ReDoS Email Validation */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">ReDoS in Email Validation</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-green">Resolved</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The email validation regex used in organizer and attendee fields was vulnerable to Regular Expression
                  Denial of Service (ReDoS). Crafted input strings could cause catastrophic backtracking, blocking
                  the main thread.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Fixed in v2.1.22 -- replaced vulnerable regex with linear-time validation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>New regex has O(n) worst-case complexity, preventing backtracking attacks</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Affects ICS parsing of ORGANIZER and ATTENDEE fields with mailto: URIs</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/core/issues/111" className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #111
                  </a>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">-- Resolved in v2.1.22</span>
                </div>
              </div>

              {/* Workflow Permissions */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">CI/CD Workflow Permissions</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-green">Resolved</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  GitHub Actions workflows were using default (write-all) permissions, granting more access than
                  necessary. This is a supply chain hardening concern -- overly permissive workflows can be exploited
                  if a dependency or action is compromised.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Fixed -- explicit least-privilege <span className="font-mono text-xs">permissions</span> blocks added to all workflows</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Read-only default with scoped write access only where required</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Follows GitHub&apos;s recommended security hardening for Actions</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/core/issues/112" className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #112
                  </a>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">-- Resolved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Bug Fixes */}
          <div className="mt-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Critical Bug Fixes (v2.1.22)</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                The following correctness bugs were identified and resolved in v2.1.22. While not direct security
                vulnerabilities, correctness bugs in date/time handling can lead to data integrity issues in
                production calendar systems.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Issue</th>
                    <th>Bug</th>
                    <th>Impact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a href="https://github.com/forceCalendar/core/issues/107" className="font-mono text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                        #107
                      </a>
                    </td>
                    <td className="text-sm text-slate-700 dark:text-slate-300">TimezoneManager.parseTimezone() property name mismatch</td>
                    <td className="text-sm text-slate-500 dark:text-slate-400">Timezone abbreviations (e.g. PST, EST) could fail to resolve</td>
                    <td><span className="badge badge-green">Resolved</span></td>
                  </tr>
                  <tr>
                    <td>
                      <a href="https://github.com/forceCalendar/core/issues/108" className="font-mono text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                        #108
                      </a>
                    </td>
                    <td className="text-sm text-slate-700 dark:text-slate-300">ICSParser VALARM export uses wrong property name</td>
                    <td className="text-sm text-slate-500 dark:text-slate-400">Alarm/reminder data lost during ICS round-trip export</td>
                    <td><span className="badge badge-green">Resolved</span></td>
                  </tr>
                  <tr>
                    <td>
                      <a href="https://github.com/forceCalendar/core/issues/109" className="font-mono text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                        #109
                      </a>
                    </td>
                    <td className="text-sm text-slate-700 dark:text-slate-300">DateUtils.isDST() returns inverted boolean</td>
                    <td className="text-sm text-slate-500 dark:text-slate-400">DST detection logic inverted, causing incorrect time offsets</td>
                    <td><span className="badge badge-green">Resolved</span></td>
                  </tr>
                  <tr>
                    <td>
                      <a href="https://github.com/forceCalendar/core/issues/110" className="font-mono text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                        #110
                      </a>
                    </td>
                    <td className="text-sm text-slate-700 dark:text-slate-300">DateUtils.addHoursWithDST() double-adjusts offset</td>
                    <td className="text-sm text-slate-500 dark:text-slate-400">Events shifted by double the DST offset during transitions</td>
                    <td><span className="badge badge-green">Resolved</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                All fixes shipped in PRs #113--#118. See individual GitHub issues for technical details and regression tests.
              </p>
            </div>
          </div>

          {/* Hardening -- August 2026 */}
          <div className="mt-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Hardening -- August 2026</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                A CI/CD fix in both publish pipelines, CPU-exhaustion mitigations in the recurrence engine, and a clean
                sweep of the dev-dependency advisories.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">core · interface</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">publish workflows</span>
                </div>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Command-injection fix: the release step interpolated the commit message directly into a shell script; it is now passed through an environment variable</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Both workflows publish with npm provenance; the release-banner step authenticates with a bearer-token secret</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Dev-dependency trees updated to clear the <span className="font-mono text-xs">brace-expansion</span>, <span className="font-mono text-xs">js-yaml</span>, <span className="font-mono text-xs">nanoid</span> and <span className="font-mono text-xs">postcss</span> advisories (interface 1.6.0 -- 1.7.0)</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">@forcecalendar/core</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">v2.5.1 -- v2.5.2</span>
                </div>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Bounded recurrence expansion: a hard iteration limit (<span className="font-mono text-xs">MAX_ITERATIONS_HARD_LIMIT</span>) caps every expansion loop</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Incremental timezone-transition caches: a far-past DTSTART no longer triggers multi-second rescans (CPU DoS mitigation)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Recurrence rule objects are no longer mutated during expansion</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Occurrence-id resolution is consistent across APIs; hourCycle fix for older ICU builds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continued Hardening */}
          <div className="mt-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Continued Hardening (2026)</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Security and stability work is ongoing. The most recent release series shipped further
                hardening across both packages.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">@forcecalendar/core</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">v2.1.63 -- v2.1.68</span>
                </div>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Hardened ICS import and timezone parsing against malformed input</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Stabilized search worker indexing, event overlap indexing, and recurring event expansion</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">@forcecalendar/interface</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">v1.0.60</span>
                </div>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span><span className="font-mono text-xs">parseHTML()</span> now sanitizes by default -- strips script-capable elements, inline event handlers, and <span className="font-mono text-xs">javascript:</span> URLs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Focus trapping fixed inside Shadow DOM; animation waits can no longer hang callers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Defensive escaping of color labels and values in the event form</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remediation Tracker — dynamic from GitHub */}
      <RemediationTracker
        findings={findings}
        resolvedCount={resolvedCount}
        openCount={openCount}
        fetchDate={fetchDate}
      />

      {/* Methodology */}
      <section id="methodology" className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8">
            Methodology
          </h2>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
              <div className="p-6">
                <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Audit approach</h3>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">1.</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Manual code review</strong> -- line-by-line analysis of core and interface packages, focusing on input handling, DOM manipulation, and data flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">2.</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Dependency analysis</strong> -- verification of zero-dependency claim via <span className="font-mono text-xs">npm ls</span> and package.json inspection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">3.</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">CSP compatibility testing</strong> -- deployment and validation in Salesforce Locker Service and strict CSP headers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">4.</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Attack surface mapping</strong> -- identification of all input vectors, trust boundaries, and data flows</span>
                  </li>
                </ul>
              </div>
              <div className="p-6">
                <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Recommended tooling</h3>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span><span className="font-mono text-xs">npm audit</span> -- checks for known vulnerabilities in dependencies (always clean for forceCalendar)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span><span className="font-mono text-xs">eslint-plugin-security</span> -- static analysis for common security anti-patterns in JavaScript</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Snyk</strong> -- continuous vulnerability monitoring and code analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">GitHub Dependabot</strong> -- automated dependency updates (minimal surface for forceCalendar due to zero deps)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Scope</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                This audit covers <span className="font-mono text-xs">@forcecalendar/core</span> and{' '}
                <span className="font-mono text-xs">@forcecalendar/interface</span> as published on npm.
                The Salesforce LWC wrapper, documentation site, and benchmark tooling are out of scope.
                This is a self-assessment, not a third-party audit. We encourage independent security researchers
                to verify these findings. Vulnerabilities should be reported privately through GitHub as described in the{' '}
                <a href="https://github.com/forceCalendar/.github/blob/main/SECURITY.md" className="underline decoration-slate-300 dark:decoration-slate-600 hover:text-slate-900 dark:hover:text-white">security policy</a>,
                never as a public issue.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
