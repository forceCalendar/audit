import Nav from '../components/Nav';
import Footer from '../components/Footer';
import RemediationTracker from '../components/RemediationTracker';
import { fetchSecurityFindings } from './lib/github';

const cspDirectives = [
  { directive: "script-src 'self'", compatible: true, note: 'No eval(), no new Function(), no inline scripts' },
  { directive: "style-src 'self'", compatible: true, note: 'All styles via CSS custom properties and stylesheets' },
  { directive: "img-src 'self'", compatible: true, note: 'No dynamic image loading from external sources' },
  { directive: "connect-src 'self'", compatible: true, note: 'ICS fetch respects connect-src (configurable)' },
  { directive: "object-src 'none'", compatible: true, note: 'No plugins, embeds, or applets' },
  { directive: "base-uri 'self'", compatible: true, note: 'No base tag manipulation' },
];

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
          <div className="mt-8 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-left max-w-2xl mx-auto">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This is not a marketing page. This audit documents real findings, including open vulnerabilities
              and their remediation status. We believe transparency builds more trust than a clean report
              that hides issues.
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
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Verified by running <span className="font-mono text-xs">npm ls --all --json</span> on{' '}
                <span className="font-mono text-xs">@forcecalendar/core</span> and{' '}
                <span className="font-mono text-xs">@forcecalendar/interface</span>.
                Both packages list zero <span className="font-mono text-xs">dependencies</span> in their package.json.
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
                -- one of the most restrictive JavaScript sandboxes in production use. The library uses no patterns
                that would violate common CSP directives.
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
                      <td>
                        <span className="badge badge-green">Compatible</span>
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
                * innerHTML is used in <span className="font-mono text-xs">@forcecalendar/interface</span> renderers and is tracked as finding DOM-001.
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
                  <span className="badge badge-yellow">In Progress</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The Web Components interface layer renders event data into the DOM. Certain renderers
                  use <span className="font-mono text-xs">innerHTML</span> to insert content, which creates a cross-site scripting
                  vector if event data contains untrusted input.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                    <span>innerHTML in renderers can execute injected scripts via event titles or descriptions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Shadow DOM provides partial isolation from the host page</span>
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
                  <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">-- Under remediation</span>
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
                to verify these findings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section id="disclosure" className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8">
            Responsible Disclosure
          </h2>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="p-6">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Reporting security vulnerabilities</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                If you discover a security vulnerability in forceCalendar, we ask that you disclose it responsibly.
                Please do not open a public GitHub issue for security findings.
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Preferred method</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Use <a href="https://github.com/forceCalendar/core/security/advisories" className="underline decoration-slate-300 dark:decoration-slate-600 hover:text-slate-900 dark:hover:text-white">GitHub Security Advisories</a> on
                    the relevant repository (<span className="font-mono text-xs">core</span> or <span className="font-mono text-xs">interface</span>).
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-mono text-xs">security@forcecalendar.org</span>
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Response commitment</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We aim to acknowledge reports within <strong className="text-slate-700 dark:text-slate-300">48 hours</strong> and
                    provide a remediation timeline within <strong className="text-slate-700 dark:text-slate-300">7 days</strong>.
                    Critical vulnerabilities will be patched and released as soon as a fix is verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
