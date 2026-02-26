const REPOS = [
  { owner: 'forceCalendar', repo: 'core', component: '@forcecalendar/core' },
  { owner: 'forceCalendar', repo: 'interface', component: '@forcecalendar/interface' },
];

function extractSeverity(labels) {
  for (const label of labels) {
    if (label.name === 'priority:critical') return 'Critical';
    if (label.name === 'priority:high') return 'High';
    if (label.name === 'priority:medium') return 'Medium';
    if (label.name === 'priority:low') return 'Low';
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
  if (issue.state === 'closed') return 'Resolved';
  // Check for "in progress" related labels
  for (const label of issue.labels) {
    if (label.name.includes('in-progress') || label.name.includes('wip')) return 'In Progress';
  }
  if (issue.assignee) return 'In Progress';
  return 'Open';
}

export async function fetchSecurityFindings() {
  const allFindings = [];

  for (const { owner, repo, component } of REPOS) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=type:security&state=all&per_page=100&sort=created&direction=asc`;

    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'forceCalendar-audit-site',
        },
        next: { revalidate: false }, // Static: fetched at build time only
      });

      if (!res.ok) {
        console.error(`GitHub API error for ${owner}/${repo}: ${res.status} ${res.statusText}`);
        continue;
      }

      const issues = await res.json();

      // Deduplicate by title -- some issues were created twice (e.g. interface #38 and #39)
      // Keep the latest (highest number) for each unique title
      const seenTitles = new Map();
      for (const issue of issues) {
        const normalizedTitle = issue.title.replace(/^(CRITICAL|HIGH|MEDIUM|LOW):\s*/i, '').trim();
        const existing = seenTitles.get(normalizedTitle);
        if (!existing || issue.number > existing.number) {
          seenTitles.set(normalizedTitle, issue);
        }
      }

      for (const issue of seenTitles.values()) {
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
    } catch (err) {
      console.error(`Failed to fetch issues for ${owner}/${repo}:`, err.message);
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

  return { findings: allFindings, fetchedAt };
}
