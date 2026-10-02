'use client';

import { useState } from 'react';
import { Pill } from './ui';

const severityTone = { Critical: 'bad', High: 'warn', Medium: 'accent', Low: 'neutral' };
const statusTone = { Resolved: 'ok', 'In Progress': 'warn', Open: 'bad', 'Closed (not planned)': 'neutral' };

// Resolved rows beyond this count per component are folded behind "Show all"
const VISIBLE_RESOLVED = 6;

function formatDate(dateString) {
  if (!dateString) return '--';
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function formatStamp(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }) + ' UTC';
}

function Row({ f, expanded, hidden = false }) {
  // Folded rows stay in the DOM (and the served HTML) so every issue link is
  // present; `hidden` only collapses them visually.
  return (
    <tr hidden={hidden}>
      <td className="whitespace-nowrap">
        <a href={f.url} className="font-mono text-xs text-muted transition-colors hover:text-accent-text">
          #{f.number}
        </a>
      </td>
      <td className="min-w-[17rem]">
        <div className="text-sm text-fg">{f.title}</div>
        {expanded && f.description && <div className="mt-1 max-w-xl text-xs leading-relaxed text-subtle">{f.description}</div>}
      </td>
      <td><Pill tone={severityTone[f.severity] || 'neutral'}>{f.severity}</Pill></td>
      <td><Pill tone={statusTone[f.status] || 'neutral'}>{f.status}</Pill></td>
      <td className="hidden whitespace-nowrap text-xs text-muted tabular md:table-cell">{formatDate(f.createdAt)}</td>
      <td className="whitespace-nowrap text-xs text-muted tabular">{formatDate(f.closedAt)}</td>
    </tr>
  );
}

function ComponentGroup({ component, repo, findings }) {
  const [showAll, setShowAll] = useState(false);
  const open = findings.filter((f) => f.status === 'Open' || f.status === 'In Progress');
  const unplanned = findings.filter((f) => f.status === 'Closed (not planned)');
  const resolved = findings.filter((f) => f.status === 'Resolved');
  const hidden = Math.max(0, resolved.length - VISIBLE_RESOLVED);

  return (
    <div className="border-t border-hairline first:border-t-0">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-sunken/60 px-5 py-3 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-mono text-sm font-medium text-fg">{component}</h3>
          <span className="text-xs text-subtle tabular">
            {findings.length} findings · {resolved.length} resolved · {open.length} open · {unplanned.length} not planned
          </span>
        </div>
        <a href={`https://github.com/${repo}/issues?q=label%3Atype%3Asecurity`} className="link-quiet text-xs">
          {repo} issues
        </a>
      </div>

      <div className="overflow-x-auto md:overflow-visible">
        <table className={`data-table sticky-head ${showAll ? '' : 'compact'}`}>
          <thead>
            <tr>
              <th>Issue</th>
              <th>Finding</th>
              <th>Severity</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Opened</th>
              <th>Closed</th>
            </tr>
          </thead>
          <tbody>
            {open.map((f) => <Row key={f.number} f={f} expanded />)}
            {unplanned.map((f) => <Row key={f.number} f={f} expanded />)}
            {resolved.map((f, i) => <Row key={f.number} f={f} expanded={showAll} hidden={!showAll && i >= VISIBLE_RESOLVED} />)}
          </tbody>
        </table>
      </div>

      {(hidden > 0 || showAll) && (
        <div className="border-t border-hairline px-5 py-2.5 sm:px-6">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="text-xs font-medium text-accent-text transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {showAll ? `Show fewer (first ${VISIBLE_RESOLVED} resolved)` : `Show all ${resolved.length} resolved with details`}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Findings grouped by package. Counts are always visible; only the long tail
 * of resolved rows folds. Rendered on the server with ISR data and hydrated
 * for the toggle.
 */
export default function RemediationTracker({ findings, fetchedAt, failedQueries = 0, totalQueries = 0 }) {
  const resolvedCount = findings.filter((f) => f.status === 'Resolved').length;
  const openCount = findings.filter((f) => f.status === 'Open' || f.status === 'In Progress').length;
  const unplannedCount = findings.filter((f) => f.status === 'Closed (not planned)').length;
  const unavailable = failedQueries === totalQueries && totalQueries > 0;

  const groups = [];
  for (const f of findings) {
    let g = groups.find((x) => x.component === f.component);
    if (!g) {
      g = { component: f.component, repo: f.repo, findings: [] };
      groups.push(g);
    }
    g.findings.push(f);
  }

  return (
    <div className="rounded-xl bg-raised ring-1 ring-hairline shadow-elev-1 dark:shadow-none ring-hi">
      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-t-xl bg-hairline">
        <div className="bg-raised px-4 py-4 text-center sm:py-5">
          <div className="font-display text-2xl font-semibold tracking-[-0.03em] tabular text-fg sm:text-3xl">{unavailable ? '—' : findings.length}</div>
          <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Findings</div>
        </div>
        <div className="bg-raised px-4 py-4 text-center sm:py-5">
          <div className="font-display text-2xl font-semibold tracking-[-0.03em] tabular text-ok sm:text-3xl">{unavailable ? '—' : resolvedCount}</div>
          <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Resolved</div>
        </div>
        <div className="bg-raised px-4 py-4 text-center sm:py-5">
          <div className={`font-display text-2xl font-semibold tracking-[-0.03em] tabular sm:text-3xl ${openCount > 0 ? 'text-warn' : 'text-ok'}`}>{unavailable ? '—' : openCount}</div>
          <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Open</div>
        </div>
      </div>

      {unplannedCount > 0 && <p className="border-t border-hairline px-5 py-3 text-xs text-subtle">{unplannedCount} closed as not planned, not counted as resolved.</p>}

      {failedQueries > 0 && (
        <div className="border-t border-hairline bg-warn-soft/60 px-5 py-3 text-xs text-warn sm:px-6">
          {failedQueries} of {totalQueries} GitHub queries failed on the last refresh; the counts above may be incomplete.
        </div>
      )}

      {findings.length === 0 ? (
        <div className="border-t border-hairline px-6 py-10 text-center">
          <p className="text-sm text-subtle">No findings fetched. The GitHub API may be temporarily unavailable; the page retries on its next hourly refresh.</p>
        </div>
      ) : (
        <div className="border-t border-hairline">
          {groups.map((g) => <ComponentGroup key={g.component} {...g} />)}
        </div>
      )}

      <div className="flex flex-col gap-1.5 rounded-b-xl border-t border-hairline bg-sunken/70 px-5 py-4 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Issues labelled <code className="code">type:security</code>, or <code className="code">type:bug</code> with{' '}
          <code className="code">priority:critical</code> / <code className="code">priority:high</code>, from{' '}
          <a href="https://github.com/forceCalendar/core/issues?q=label%3Atype%3Asecurity" className="link-quiet">forceCalendar/core</a>
          {' '}and{' '}
          <a href="https://github.com/forceCalendar/interface/issues?q=label%3Atype%3Asecurity" className="link-quiet">forceCalendar/interface</a>.
        </p>
        <p className="whitespace-nowrap">
          Data refreshed <time dateTime={fetchedAt} className="tabular text-muted">{formatStamp(fetchedAt)}</time> · hourly
        </p>
      </div>
    </div>
  );
}
