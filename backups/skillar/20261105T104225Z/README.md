# Skillar catalog backup

Captured from https://skillar.sh on 2026-11-05T10:42:25.391Z.

- 84 skills, 85 retained immutable versions.
- 128 files in the selected current versions (850618 bytes).
- 129 resource instances across all retained versions.
- Catalog revision 115; catalog reads before and after capture were identical.

## Contents

- `skills/<name>/`: decoded files from each selected current version. These are copies, not a new authoring source.
- `versions/<skill-id>/<digest>.json`: complete version exports, including the original manifest, media types, base64 file bodies, creation time and pin state.
- `catalog.json` and `skill-details.json`: original skill IDs, selected head digests/revisions and retained version membership. The selected head is not necessarily the newest-created version.
- `inventory.json`: SHA-256 and byte count for every snapshot file except itself.
- `audit.json`: integrity and credential-pattern scan results. A pattern scan is not a guarantee that all sensitive information has been identified.

## Verify

Run `node verify.mjs` from this directory. It uses only Node built-ins and performs no network requests or writes. It verifies the exact file set, hashes, package manifests, all retained versions and the selected current file bytes.

## Recovery boundaries

For a current-content recovery, select a folder under `skills/` in Skillar's upload UI with separate upload consent. Retain the version JSON and metadata when restoring historical content or mapping original skill IDs. Uploading files alone does not recreate the original account, version revision counters or server timestamps.

This is a content backup, not a server/database or credential backup. OAuth grants, tokens, account records and read/evaluation history are not included. Versions deleted before capture cannot be recovered from this snapshot. File executable modes are not represented by the hosted package format.

The live source remains Skillar. This backup neither republishes content nor reactivates the retired R2 publisher. Existing Git-only material, including `archify`, remains untouched elsewhere in this repository.
