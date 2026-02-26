const severityBadge = (severity) => {
  const map = { Critical: 'badge-red', High: 'badge-orange', Medium: 'badge-yellow', Low: 'badge-slate' };
  return map[severity] || 'badge-slate';
};

const statusBadge = (status) => {
  const map = {
    'Resolved': 'badge-green',
    'In Progress': 'badge-yellow',
    'Open': 'badge-red',
  };
  return map[status] || 'badge-slate';
};

function formatDate(dateString) {
  if (!dateString) return '--';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RemediationTracker({ findings, resolvedCount, openCount, fetchDate }) {
  return (
    <section id="remediation" className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
          Remediation Tracker
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Fetched from GitHub Issues at build time. {resolvedCount} resolved, {openCount} open.
        </p>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
          {/* Summary metrics */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">{findings.length}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Total Findings</div>
            </div>
            <div className="px-6 py-4 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">{resolvedCount}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Resolved</div>
            </div>
            <div className="px-6 py-4 text-center">
              <div className={`text-2xl font-bold tracking-tight font-mono ${openCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {openCount}
              </div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Open</div>
            </div>
          </div>

          {/* Findings table */}
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Finding</th>
                  <th>Component</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Opened</th>
                  <th>Closed</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f) => (
                  <tr key={`${f.repo}-${f.number}`}>
                    <td>
                      <a href={f.url} className="font-mono text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600">
                        #{f.number}
                      </a>
                    </td>
                    <td>
                      <div className="text-sm text-slate-700 dark:text-slate-300">{f.title}</div>
                      {f.description && (
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed max-w-md">{f.description}</div>
                      )}
                    </td>
                    <td className="font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{f.component}</td>
                    <td><span className={`badge ${severityBadge(f.severity)}`}>{f.severity}</span></td>
                    <td><span className={`badge ${statusBadge(f.status)}`}>{f.status}</span></td>
                    <td className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(f.createdAt)}</td>
                    <td className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(f.closedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {findings.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No security findings fetched. The GitHub API may be temporarily unavailable.
              </p>
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Data sourced from{' '}
              <a href="https://github.com/forceCalendar/core/issues?q=label%3Atype%3Asecurity" className="underline decoration-slate-300 dark:decoration-slate-600 hover:text-slate-600 dark:hover:text-slate-300">forceCalendar/core</a>
              {' '}and{' '}
              <a href="https://github.com/forceCalendar/interface/issues?q=label%3Atype%3Asecurity" className="underline decoration-slate-300 dark:decoration-slate-600 hover:text-slate-600 dark:hover:text-slate-300">forceCalendar/interface</a>
              {' '}GitHub issues with <span className="font-mono text-xs">type:security</span> label.
              Last built: {fetchDate}. Refreshed on each deploy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
