const REPOS = [
  { owner: 'forceCalendar', repo: 'core', component: '@forcecalendar/core' },
  { owner: 'forceCalendar', repo: 'interface', component: '@forcecalendar/interface' },
];

// Fetch both security findings and critical/high-priority bugs
const LABEL_QUERIES = [
  'type:security',
  'type:bug,priority:critical',
  'type:bug,priority:high',
];

function extractSeverity(labels) {
  for (const severity of ['Critical', 'High', 'Medium', 'Low']) {
    if (labels.some((label) => label.name === `priority:${severity.toLowerCase()}`)) return severity;
  }
  return 'Unknown';
}

function extractDescription(body) {
  if (!body) return '';
  // Remove markdown headers and code blocks, take first meaningful paragraph
  const lines = body.split('\n');
  const textLines = [];
  let inCodeBlock = false;
  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('File:') || line.startsWith('Files:')) continue;
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      textLines.push(trimmed);
    }
  }
  const text = textLines.join(' ');
  if (text.length > 200) {
    return text.slice(0, 200).replace(/\s+\S*$/, '') + '...';
  }
  return text;
}

function deriveStatus(issue) {
  if (issue.state === 'closed') return issue.state_reason === 'not_planned' ? 'Closed (not planned)' : 'Resolved';
  // Check for "in progress" related labels
  for (const label of issue.labels) {
    if (label.name.includes('in-progress') || label.name.includes('wip')) return 'In Progress';
  }
  if (issue.assignee) return 'In Progress';
  return 'Open';
}

export async function fetchSecurityFindings({ fetcher = fetch } = {}) {
  const allFindings = [];
  // Every query degrades independently; the page reports how many failed so
  // a partial result is never mistaken for a clean one.
  const totalQueries = REPOS.length * LABEL_QUERIES.length;
  let failedQueries = 0;

  for (const { owner, repo, component } of REPOS) {
    // Deduplicate across all label queries by issue number
    const seenIssues = new Map();

    for (const labels of LABEL_QUERIES) {
      try {
        let page = 1;
        while (true) {
          const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${encodeURIComponent(labels)}&state=all&per_page=100&sort=created&direction=asc&page=${page}`;
          const res = await fetcher(url, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'forceCalendar-audit-site',
            },
            // ISR: the rendered page is regenerated at most once an hour, so
            // the tracker follows GitHub without a redeploy.
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(15000),
          });

          if (!res.ok) {
            console.error(`GitHub API error for ${owner}/${repo} (${labels}): ${res.status} ${res.statusText}`);
            failedQueries += 1;
            break;
          }

          const issues = await res.json();

          for (const issue of issues) {
            // The Issues API also returns pull requests; these are not findings.
            if (issue.pull_request) continue;
            // Deduplicate by issue number (same issue may match multiple label queries)
            if (!seenIssues.has(issue.number)) {
              seenIssues.set(issue.number, issue);
            }
          }
          if (!res.headers.get('link')?.includes('rel="next"')) break;
          page += 1;
        }
      } catch (err) {
        console.error(`Failed to fetch issues for ${owner}/${repo} (${labels}):`, err.message);
        failedQueries += 1;
      }
    }

    // Distinct issue numbers remain distinct, even if their titles match.
    // Otherwise a later closed duplicate could hide an older open finding.
    for (const issue of seenIssues.values()) {
      allFindings.push({
        number: issue.number,
        title: issue.title,
        component,
        repo: `${owner}/${repo}`,
        severity: extractSeverity(issue.labels),
        status: deriveStatus(issue),
        url: issue.html_url,
        description: extractDescription(issue.body),
        createdAt: issue.created_at,
        closedAt: issue.closed_at,
      });
    }
  }

  // Sort by severity (Critical > High > Medium > Low), then by issue number
  const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3, Unknown: 4 };
  allFindings.sort((a, b) => {
    const sevDiff = (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4);
    if (sevDiff !== 0) return sevDiff;
    return a.number - b.number;
  });

  const fetchedAt = new Date().toISOString();

  return { findings: allFindings, fetchedAt, failedQueries, totalQueries };
}
