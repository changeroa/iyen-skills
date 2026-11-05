# Skillar offline backups

The live personal catalog is authored and versioned at https://skillar.sh/skills/. These Git snapshots are disaster-recovery copies, not the source of truth or a publication trigger. No live catalog or legacy runtime configuration is changed by committing a backup.

Latest snapshot: [20261105T104225Z](./20261105T104225Z/). The machine-readable pointer is [latest.json](./latest.json).

This snapshot contains **84 skills, 85 retained versions and 128 current files**, plus version and head metadata. It preserves all files and all versions still retained at capture, not only SKILL.md or the most recently created version. Run the snapshot's `verify.mjs` before recovery.

Existing repository history, source skills, packs, evaluations and policies remain preserved. Future snapshots should use new timestamp directories rather than overwrite an earlier capture.

## Integrity regression checks

Run `node --test backups/skillar/verify.test.mjs` from the repository root. The checks relocate the snapshot and confirm that modified current files, corrupt package bytes and missing retained history are rejected. They do not restore data to the hosted service or evaluate skill effectiveness.
