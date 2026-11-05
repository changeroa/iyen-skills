import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
function safe(p) {
  assert.equal(typeof p, 'string');
  assert.ok(!path.posix.isAbsolute(p) && !p.includes('\\') && !p.includes('\0'));
  assert.ok(p.split('/').every(s => s && s !== '.' && s !== '..'));
  return p;
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    assert.ok(!e.isSymbolicLink(), 'Symlinks are not backup resources');
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [path.relative(root, p).split(path.sep).join('/')];
  });
}
const inventory = read(path.join(root, 'inventory.json'));
assert.equal(inventory.schemaVersion, 1);
assert.deepEqual(walk(root).sort(), [...inventory.files.map(f => f.path), 'inventory.json'].sort());
for (const f of inventory.files) {
  const bytes = fs.readFileSync(path.join(root, safe(f.path)));
  assert.equal(bytes.length, f.bytes, f.path);
  assert.equal(hash(bytes), f.sha256, f.path);
}
const catalog = read(path.join(root, 'catalog.json'));
const details = read(path.join(root, 'skill-details.json'));
assert.equal(details.length, catalog.skills.length);
assert.equal(new Set(catalog.skills.map(s => s.skillId)).size, catalog.skills.length);
assert.equal(new Set(catalog.skills.map(s => s.name)).size, catalog.skills.length);
let versions = 0, currentFiles = 0, resourceInstances = 0;
const expectedCurrent = [], expectedVersions = [];
for (const s of catalog.skills) {
  assert.match(s.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  const d = details.find(d => d.skill.skillId === s.skillId);
  assert.ok(d);
  assert.deepEqual(d.skill, s);
  assert.ok(d.versions.some(v => v.digest === s.head.digest), 'Current version must be retained');
  assert.equal(new Set(d.versions.map(v => v.digest)).size, d.versions.length);
  for (const v of d.versions) {
    assert.match(v.digest, /^[a-f0-9]{64}$/);
    const versionPath = 'versions/' + s.skillId + '/' + v.digest + '.json';
    expectedVersions.push(versionPath);
    const e = read(path.join(root, safe(versionPath)));
    assert.equal(e.skillId, s.skillId);
    assert.deepEqual(e.version, v);
    const p = e.package;
    assert.equal(p.manifestDigest, v.digest);
    assert.equal(hash(Buffer.from(JSON.stringify(p.manifest))), v.digest);
    assert.equal(p.manifest.entrypoint, 'SKILL.md');
    assert.equal(p.contents.length, p.manifest.resources.length);
    const paths = new Set();
    for (const [i, m] of p.manifest.resources.entries()) {
      safe(m.path);
      assert.ok(!paths.has(m.path.toLowerCase()), 'Duplicate resource path');
      paths.add(m.path.toLowerCase());
      const f = p.contents[i];
      assert.equal(f.path, m.path);
      const bytes = Buffer.from(f.body, 'base64');
      assert.equal(bytes.toString('base64'), f.body);
      assert.equal(bytes.length, m.bytes);
      assert.equal(hash(bytes), m.digest);
      resourceInstances++;
      if (v.digest === s.head.digest) {
        const currentPath = 'skills/' + s.name + '/' + m.path;
        expectedCurrent.push(currentPath);
        assert.deepEqual(fs.readFileSync(path.join(root, safe(currentPath))), bytes);
        currentFiles++;
      }
    }
    assert.ok(paths.has('skill.md'));
    versions++;
  }
}
assert.deepEqual(walk(path.join(root, 'skills')).sort(), expectedCurrent.sort());
assert.deepEqual(walk(path.join(root, 'versions')).sort(), expectedVersions.sort());
assert.deepEqual({ skills: details.length, versions, currentFiles, resourceInstances }, inventory.expected);
console.log(JSON.stringify({ verified: true, ...inventory.expected }));
