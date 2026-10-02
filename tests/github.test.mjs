import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchSecurityFindings } from '../app/lib/github.js';

const issue = (number, overrides = {}) => ({
  number, title: `Finding ${number}`, state: 'open', labels: [{ name: 'type:security' }],
  html_url: `https://github.com/forceCalendar/core/issues/${number}`,
  body: 'An example finding.', created_at: '2026-10-01T00:00:00Z', closed_at: null, ...overrides,
});
const response = (body, next = false) => new Response(JSON.stringify(body), {
  headers: next ? { link: '<https://api.github.com/example?page=2>; rel="next"' } : {},
});
const coreSecurity = (url) => url.includes('/core/') && new URL(url).searchParams.get('labels') === 'type:security';

test('follows pagination, excludes PRs and deduplicates only identical issue numbers', async () => {
  const calls = [];
  const result = await fetchSecurityFindings({ fetcher: async (url) => {
    calls.push(url);
    if (coreSecurity(url)) {
      return new URL(url).searchParams.get('page') === '1'
        ? response([issue(1), issue(99, { pull_request: {} })], true)
        : response([issue(2, { title: 'Finding 1', state: 'closed' })]);
    }
    return response(url.includes('/core/') ? [issue(1)] : []);
  } });
  assert.equal(calls.length, 7);
  assert.equal(result.findings.length, 2);
  assert.deepEqual(result.findings.map((f) => f.status), ['Open', 'Resolved']);
  assert.equal(result.failedQueries, 0);
});

test('not-planned closures are not fixes; severity selects the highest label', async () => {
  const result = await fetchSecurityFindings({ fetcher: async (url) => response(coreSecurity(url) ? [
    issue(1, { state: 'closed', state_reason: 'not_planned', labels: [{ name: 'priority:low' }, { name: 'priority:critical' }] }),
    issue(2, { assignee: { login: 'maintainer' } }),
  ] : []) });
  assert.equal(result.findings[0].status, 'Closed (not planned)');
  assert.equal(result.findings[0].severity, 'Critical');
  assert.equal(result.findings[1].status, 'In Progress');
});

test('a failed later page preserves known findings and reports incomplete data', async () => {
  const result = await fetchSecurityFindings({ fetcher: async (url) => {
    if (!coreSecurity(url)) return response([]);
    return new URL(url).searchParams.get('page') === '1' ? response([issue(1)], true) : new Response('', { status: 503 });
  } });
  assert.equal(result.findings.length, 1);
  assert.equal(result.failedQueries, 1);
  assert.equal(result.totalQueries, 6);
});

test('total outage is distinguishable from an empty complete result', async () => {
  const result = await fetchSecurityFindings({ fetcher: async () => { throw new Error('network unavailable'); } });
  assert.equal(result.findings.length, 0);
  assert.equal(result.failedQueries, result.totalQueries);
  assert.equal(result.totalQueries, 6);
});

test('malformed API data is incomplete, not a clean scan', async () => {
  const result = await fetchSecurityFindings({ fetcher: async (url) => response(coreSecurity(url) ? { message: 'unavailable' } : []) });
  assert.equal(result.failedQueries, 1);
});
