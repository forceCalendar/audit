import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const evidence = JSON.parse(readFileSync(new URL('../public/evidence/2026-10-02.json', import.meta.url)));

test('public evidence pins every release and separates source from npm provenance', () => {
  assert.equal(evidence.verifiedDate, '2026-10-02');
  assert.deepEqual(evidence.packages.map((p) => [p.pkg.split('/')[1], p.version]), [
    ['core', '2.5.6'], ['interface', '1.9.0'], ['react', '0.3.1'], ['vue', '0.3.1'],
  ]);
  for (const pkg of evidence.packages) {
    assert.match(pkg.testedCommit, /^[a-f0-9]{40}$/);
    assert.match(pkg.registryGitHead, /^[a-f0-9]{40}$/);
    assert.match(pkg.integrity, /^sha512-/);
    assert.equal(new URL(pkg.attestation.url).hostname, 'registry.npmjs.org');
    assert.equal(Object.keys(pkg.runtimeDependencies).length, 0);
    assert.equal(pkg.audit.vulnerabilities.total, 0);
    assert.match(pkg.audit.scope, /development/);
  }
  assert.ok(evidence.limitations.length >= 5);
});
