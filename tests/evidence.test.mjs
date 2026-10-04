import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const evidence = JSON.parse(readFileSync(new URL('../public/evidence/2026-10-04.json', import.meta.url)));

test('public evidence pins every release and separates source from npm provenance', () => {
  assert.equal(evidence.verifiedDate, '2026-10-04');
  assert.deepEqual(evidence.packages.map((p) => [p.pkg.split('/')[1], p.version]), [
    ['core', '2.5.7'], ['interface', '1.9.1'], ['react', '0.3.1'], ['vue', '0.3.1'],
  ]);
  for (const pkg of evidence.packages) {
    assert.match(pkg.testedCommit, /^[a-f0-9]{40}$/);
    assert.match(pkg.registryGitHead, /^[a-f0-9]{40}$/);
    assert.match(pkg.integrity, /^sha512-/);
    assert.equal(new URL(pkg.attestation.url).hostname, 'registry.npmjs.org');
    assert.equal(Object.keys(pkg.runtimeDependencies).length, 0);
    assert.ok(Number.isInteger(pkg.audit.vulnerabilities.total));
    assert.match(pkg.audit.scope, /development/);
  }
  assert.ok(evidence.limitations.length >= 5);
});

test('the latest core release preserves known correctness limits and actual-release consumer scope', () => {
  const core = evidence.packages[0];
  assert.equal(core.tarball.runtimeFilesMatched, 22);
  assert.match(core.tarball.sha256, /^[a-f0-9]{64}$/);
  assert.match(core.tests, /696/);
  assert.match(core.knownLimitations.releaseCandidateFullSuite['America/Los_Angeles'], /25\/26/);
  assert.match(core.knownLimitations.releaseCandidateFullSuite['Asia/Kolkata'], /25\/26/);
  assert.equal(evidence.consumerCheck.packages['@forcecalendar/core'], '2.5.7');
  assert.match(evidence.consumerCheck.scope, /Fresh production-only consumer/);
  assert.equal(evidence.consumerCheck.packages['@forcecalendar/interface'], '1.9.1');
});

test('current development findings cannot become a misleading all-clean report', () => {
  const iface = evidence.packages.find((pkg) => pkg.pkg === '@forcecalendar/interface');
  assert.equal(iface.audit.vulnerabilities.total, 29);
  assert.equal(iface.audit.uniqueAdvisories.length, 1);
  assert.equal(iface.audit.productionOnly.total, 0);
  assert.equal(evidence.auditWebsite.audit.vulnerabilities.total, 5);
  assert.equal(evidence.auditWebsite.audit.uniqueAdvisories.length, 1);
  assert.equal(evidence.auditWebsite.audit.productionOnly.total, 0);
  assert.equal(evidence.consumerCheck.audit.vulnerabilities.total, 0);
});

test('the previous snapshot remains a separately dated historical record', () => {
  const archived = JSON.parse(readFileSync(new URL('../public/evidence/2026-10-02.json', import.meta.url)));
  assert.equal(archived.verifiedDate, '2026-10-02');
  assert.equal(archived.packages[1].version, '1.9.0');
  assert.equal(archived.packages[1].audit.vulnerabilities.total, 0);
  assert.equal(evidence.previousSnapshot, '/evidence/2026-10-02.json');
});
