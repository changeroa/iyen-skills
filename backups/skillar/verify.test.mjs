import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const base = path.dirname(fileURLToPath(import.meta.url));
const pointer = JSON.parse(fs.readFileSync(path.join(base, 'latest.json'), 'utf8'));
assert.match(pointer.snapshot, /^[0-9]{8}T[0-9]{6}Z$/);
const source = path.join(base, pointer.snapshot);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(fs.readFileSync(path.join(source, 'inventory.json'))), pointer.inventorySha256);
function fixture(fn) {
  const temp = fs.mkdtempSync(path.join(process.env.SKILLAR_BACKUP_TEST_TMP ?? os.tmpdir(), 'skillar-backup-check-'));
  try {
    const root = path.join(temp, 'snapshot');
    fs.cpSync(source, root, { recursive: true });
    return fn(root);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const put = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const run = root => spawnSync(process.execPath, [path.join(root, 'verify.mjs')], { encoding: 'utf8' });
function rehash(root, relative) {
  const file = path.join(root, relative);
  const inventory = read(path.join(root, 'inventory.json'));
  const entry = inventory.files.find(f => f.path === relative);
  const bytes = fs.readFileSync(file);
  Object.assign(entry, { bytes: bytes.length, sha256: hash(bytes) });
  put(path.join(root, 'inventory.json'), inventory);
}

test('complete snapshot verifies after relocation without credentials or network', () => fixture(root => {
  const result = run(root);
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), { verified: true, skills: pointer.skills, versions: pointer.versions, currentFiles: pointer.currentFiles, resourceInstances: pointer.resourceInstances });
}));

test('changed selected current file is rejected', () => fixture(root => {
  const entry = read(path.join(root, 'inventory.json')).files.find(f => f.path.startsWith('skills/'));
  fs.appendFileSync(path.join(root, entry.path), '\ncorruption\n');
  assert.notEqual(run(root).status, 0);
}));

test('corrupt exported package is rejected even after the outer file inventory is rehashed', () => fixture(root => {
  const entry = read(path.join(root, 'inventory.json')).files.find(f => f.path.startsWith('versions/'));
  const pkg = read(path.join(root, entry.path));
  pkg.package.contents[0].body = Buffer.from('corruption').toString('base64');
  put(path.join(root, entry.path), pkg);
  rehash(root, entry.path);
  assert.notEqual(run(root).status, 0);
}));

test('a missing retained non-current version is rejected even if removed from the outer inventory', () => fixture(root => {
  const details = read(path.join(root, 'skill-details.json'));
  const item = details.find(d => d.versions.some(v => v.digest !== d.skill.head.digest));
  assert.ok(item, 'This snapshot includes retained non-current history');
  const version = item.versions.find(v => v.digest !== item.skill.head.digest);
  const relative = 'versions/' + item.skill.skillId + '/' + version.digest + '.json';
  fs.rmSync(path.join(root, relative));
  const inventory = read(path.join(root, 'inventory.json'));
  inventory.files = inventory.files.filter(f => f.path !== relative);
  put(path.join(root, 'inventory.json'), inventory);
  assert.notEqual(run(root).status, 0);
}));
