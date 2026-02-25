'use client';

import ThemeToggle from '../components/ThemeToggle';

const findings = [
  {
    id: 'ICS-001',
    title: 'ICS parser lacks input size limits',
    component: '@forcecalendar/core',
    severity: 'Medium',
    status: 'In Progress',
    issue: 'https://github.com/forceCalendar/core/issues/37',
    description: 'The ICS parser does not enforce maximum input size or recursion depth limits, which could allow denial-of-service via crafted .ics files.',
  },
  {
    id: 'NET-001',
    title: 'ICS fetch URL lacks SSRF protection',
    component: '@forcecalendar/core',
    severity: 'Medium',
    status: 'In Progress',
    issue: 'https://github.com/forceCalendar/core/issues/38',
    description: 'When fetching remote .ics files server-side, URLs are not validated against internal/private network ranges, creating a potential SSRF vector.',
  },
  {
    id: 'DOM-001',
    title: 'innerHTML usage in DOM renderers',
    component: '@forcecalendar/interface',
    severity: 'High',
    status: 'In Progress',
    issue: 'https://github.com/forceCalendar/interface/issues/39',
    description: 'Event renderers use innerHTML to insert content into the DOM. If event data contains untrusted input, this creates a cross-site scripting (XSS) vector.',
  },
  {
    id: 'CPU-001',
    title: 'Recurrence engine algorithmic complexity',
    component: '@forcecalendar/core',
    severity: 'Low',
    status: 'Needs Analysis',
    issue: null,
    description: 'Complex or malicious RRULE patterns could cause excessive computation during recurrence expansion. Needs analysis to determine if resource limits are required.',
  },
];

const severityBadge = (severity) => {
  const map = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-slate' };
  return map[severity] || 'badge-slate';
};

const statusBadge = (status) => {
  const map = {
    'Resolved': 'badge-green',
    'In Progress': 'badge-yellow',
    'Needs Analysis': 'badge-slate',
    'Open': 'badge-red',
  };
  return map[status] || 'badge-slate';
};

const cspDirectives = [
  { directive: "script-src 'self'", compatible: true, note: 'No eval(), no new Function(), no inline scripts' },
  { directive: "style-src 'self'", compatible: true, note: 'All styles via CSS custom properties and stylesheets' },
  { directive: "img-src 'self'", compatible: true, note: 'No dynamic image loading from external sources' },
  { directive: "connect-src 'self'", compatible: true, note: 'ICS fetch respects connect-src (configurable)' },
  { directive: "object-src 'none'", compatible: true, note: 'No plugins, embeds, or applets' },
  { directive: "base-uri 'self'", compatible: true, note: 'No base tag manipulation' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Security Audit</span>
            </div>
            <ThemeToggle />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            forceCalendar Security Audit
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base leading-relaxed">
            Transparent security analysis of forceCalendar&apos;s codebase. Built for environments where security is non-negotiable.
          </p>
          <div className="mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/30 max-w-2xl">
            <p className="text-sm text-slate-500 leading-relaxed">
              This is not a marketing page. This audit documents real findings, including open vulnerabilities
              and their remediation status. We believe transparency builds more trust than a clean report
              that hides issues.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* Zero Dependencies */}
        <section>
          <div className="section-label">Supply Chain Security</div>
          <div className="panel overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800/80 border-b border-slate-200 dark:border-slate-800/80">
              <div className="px-6 py-5 text-center">
                <div className="metric-value text-emerald-600 dark:text-emerald-400">0</div>
                <div className="metric-label">Dependencies</div>
              </div>
              <div className="px-6 py-5 text-center">
                <div className="metric-value text-emerald-600 dark:text-emerald-400">0</div>
                <div className="metric-label">Transitive Deps</div>
              </div>
              <div className="px-6 py-5 text-center">
                <div className="metric-value text-emerald-600 dark:text-emerald-400">0</div>
                <div className="metric-label">npm Advisories</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold mb-3">Why this matters</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Every dependency is a potential attack vector. Supply chain attacks (like the
                {' '}<span className="mono text-xs">event-stream</span>,{' '}
                <span className="mono text-xs">ua-parser-js</span>, and{' '}
                <span className="mono text-xs">colors</span> incidents) have demonstrated that
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
                      <span><span className="mono text-xs">npm audit</span> always clean</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
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

            <div className="px-6 py-4 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Verified by running <span className="mono text-xs">npm ls --all --json</span> on{' '}
                <span className="mono text-xs">@forcecalendar/core</span> and{' '}
                <span className="mono text-xs">@forcecalendar/interface</span>.
                Both packages list zero <span className="mono text-xs">dependencies</span> in their package.json.
              </p>
            </div>
          </div>
        </section>

        {/* CSP Compliance */}
        <section>
          <div className="section-label">Content Security Policy Compliance</div>
          <div className="panel overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800/80">
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
                      <td className="mono text-xs text-slate-700 dark:text-slate-300">{row.directive}</td>
                      <td>
                        <span className="badge badge-green">Compatible</span>
                      </td>
                      <td className="text-sm text-slate-500 dark:text-slate-400">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800/80">
              <h3 className="text-sm font-semibold mb-3">Prohibited patterns</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                The following JavaScript patterns are explicitly avoided throughout the codebase:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['eval()', 'new Function()', 'document.write()', 'innerHTML *'].map((pattern) => (
                  <div key={pattern} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 text-center">
                    <span className="mono text-xs text-red-500 dark:text-red-400 line-through">{pattern}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                * innerHTML is used in <span className="mono text-xs">@forcecalendar/interface</span> renderers and is tracked as finding DOM-001.
                The core library is entirely DOM-free.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Salesforce Locker Service compatibility has been verified in production deployments.
                The library runs in Lightning Web Components without any CSP violations.
              </p>
            </div>
          </div>
        </section>

        {/* Attack Surface Analysis */}
        <section>
          <div className="section-label">Attack Surface Analysis</div>
          <div className="panel overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800/80">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                A calendar library has a specific and bounded attack surface. The following analysis
                covers the primary vectors relevant to forceCalendar&apos;s architecture.
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {/* ICS Parser */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">ICS Parser</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-yellow">Medium Risk</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The ICS parser processes external <span className="mono text-xs">.ics</span> files, which are untrusted input by definition.
                  Malformed or maliciously crafted calendar files could exploit the parser if input validation is insufficient.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                    <span>No maximum input size enforcement -- large files could cause memory exhaustion</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                    <span>No recursion depth limits on nested calendar components</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Parser is read-only -- cannot execute code or modify system state</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/core/issues/37" className="text-xs mono underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #37
                  </a>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">-- Under remediation</span>
                </div>
              </div>

              {/* URL Handling */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">URL Handling / SSRF</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-yellow">Medium Risk</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The ICS file fetching mechanism accepts URLs that could point to internal network resources.
                  In server-side contexts, this creates a Server-Side Request Forgery (SSRF) vector.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                    <span>URLs are not validated against private/internal IP ranges</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                    <span>No allowlist mechanism for permitted URL schemes or hosts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Client-side usage is mitigated by browser same-origin policy</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="https://github.com/forceCalendar/core/issues/38" className="text-xs mono underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #38
                  </a>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">-- Under remediation</span>
                </div>
              </div>

              {/* DOM Rendering */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">DOM Rendering / XSS</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mono">@forcecalendar/interface</span>
                  </div>
                  <span className="badge badge-red">High Risk</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The Web Components interface layer renders event data into the DOM. Certain renderers
                  use <span className="mono text-xs">innerHTML</span> to insert content, which creates a cross-site scripting
                  vector if event data contains untrusted input.
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 shrink-0">!</span>
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
                  <a href="https://github.com/forceCalendar/interface/issues/39" className="text-xs mono underline decoration-slate-300 dark:decoration-slate-600">
                    GitHub Issue #39
                  </a>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">-- Under remediation</span>
                </div>
              </div>

              {/* Recurrence Engine */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">Recurrence Engine</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mono">@forcecalendar/core</span>
                  </div>
                  <span className="badge badge-slate">Low Risk</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  The recurrence expansion engine processes RFC 5545 RRULE patterns. Complex or maliciously
                  crafted rules could potentially cause excessive computation (algorithmic complexity attack).
                </p>
                <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">?</span>
                    <span>No occurrence count limits on expansion -- needs analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Expansion is CPU-bound only -- no I/O or network side effects</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span>Can be mitigated with Web Worker isolation (already supported)</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-slate-400 dark:text-slate-500">No GitHub issue -- needs further analysis</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Remediation Tracker */}
        <section>
          <div className="section-label">Remediation Tracker</div>
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Finding</th>
                    <th>Component</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {findings.map((f) => (
                    <tr key={f.id}>
                      <td className="mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{f.id}</td>
                      <td className="text-sm text-slate-700 dark:text-slate-300">{f.title}</td>
                      <td className="mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{f.component}</td>
                      <td><span className={`badge ${severityBadge(f.severity)}`}>{f.severity}</span></td>
                      <td><span className={`badge ${statusBadge(f.status)}`}>{f.status}</span></td>
                      <td>
                        {f.issue ? (
                          <a href={f.issue} className="mono text-xs underline decoration-slate-300 dark:decoration-slate-600">
                            #{f.issue.split('/').pop()}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Last updated: February 2026. This tracker reflects the current state of known security findings.
                Resolved findings remain listed for transparency.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section>
          <div className="section-label">Methodology</div>
          <div className="panel overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800/80">
              <div className="p-6">
                <h3 className="text-sm font-semibold mb-3">Audit approach</h3>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">1.</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Manual code review</strong> -- line-by-line analysis of core and interface packages, focusing on input handling, DOM manipulation, and data flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">2.</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Dependency analysis</strong> -- verification of zero-dependency claim via <span className="mono text-xs">npm ls</span> and package.json inspection</span>
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
                <h3 className="text-sm font-semibold mb-3">Recommended tooling</h3>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span><span className="mono text-xs">npm audit</span> -- checks for known vulnerabilities in dependencies (always clean for forceCalendar)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span><span className="mono text-xs">eslint-plugin-security</span> -- static analysis for common security anti-patterns in JavaScript</span>
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

            <div className="p-6 border-t border-slate-200 dark:border-slate-800/80">
              <h3 className="text-sm font-semibold mb-3">Scope</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                This audit covers <span className="mono text-xs">@forcecalendar/core</span> and{' '}
                <span className="mono text-xs">@forcecalendar/interface</span> as published on npm.
                The Salesforce LWC wrapper, documentation site, and benchmark tooling are out of scope.
                This is a self-assessment, not a third-party audit. We encourage independent security researchers
                to verify these findings.
              </p>
            </div>
          </div>
        </section>

        {/* Responsible Disclosure */}
        <section>
          <div className="section-label">Responsible Disclosure</div>
          <div className="panel overflow-hidden">
            <div className="p-6">
              <h3 className="text-sm font-semibold mb-3">Reporting security vulnerabilities</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                If you discover a security vulnerability in forceCalendar, we ask that you disclose it responsibly.
                Please do not open a public GitHub issue for security findings.
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Preferred method</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Use <a href="https://github.com/forceCalendar/core/security/advisories" className="underline decoration-slate-300 dark:decoration-slate-600">GitHub Security Advisories</a> on
                    the relevant repository (<span className="mono text-xs">core</span> or <span className="mono text-xs">interface</span>).
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="mono text-xs">security@forcecalendar.org</span>
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
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
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <a href="https://github.com/forceCalendar/audit">GitHub</a>
              <a href="https://github.com/forceCalendar/core">@forcecalendar/core</a>
              <a href="https://www.npmjs.com/package/@forcecalendar/core">npm</a>
              <a href="https://forcecalendar.org">forcecalendar.org</a>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-600">
              MIT License
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
