<p align="center"><a href="README.md">English</a> · <a href="README.ko.md">한국어</a></p>

<p align="center">
  <img src="docs/assets/iyen-workshop.png" alt="The skillar workshop: instruction cards, measuring tools, and a verification bench" width="100%">
</p>
<h1 align="center">iyen-skills</h1>
<p align="center"><strong>“Just do it well” isn't a procedure.</strong><br>Less hand-waving. More procedure.</p>
<p align="center">
  <a href="#pick-a-problem">Pick a skill</a> ·
  <a href="#use-it">Use it</a> ·
  <a href="#contribute-a-skill">Contribute</a> ·
  <a href="https://github.com/changeroa/skillar">Connect with skillar</a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/format-SKILL.md-242424?style=flat-square" alt="SKILL.md format">
  <img src="https://img.shields.io/badge/delivery-skillar_MCP-c6492d?style=flat-square" alt="Delivered by skillar MCP">
</p>

---

## Source moved to skillar.sh

Personal skills are now authored and versioned directly at
[skillar.sh/skills](https://skillar.sh/skills/), and approved agents connect to
[skillar.sh/mcp](https://skillar.sh/mcp). This GitHub repository is no longer the
source of truth for that personal catalog. The legacy GitHub-to-R2 publisher is
disabled; new personal skill versions do not require a GitHub commit or release.

[Offline catalog backups](backups/skillar/) retain current files and all versions
still stored at capture for recovery. They do not replace the hosted source of
truth or reactivate the legacy publisher.

Keep this repository and its history as a reference. In particular, retain
[`eval/`](eval/), its datasets and results, and the associated policies as the
specification inputs for a future skillar evaluation-gated promotion feature.
Uploading or versioning a skill in skillar does not implement that future gate.
The retained catalog below and its local runtime instructions remain
available for reference; the repository itself is not archived or deleted.

## “Act like an expert.” And do what, exactly?

People say they've uploaded tacit knowledge. Encoded expertise. Transferred know-how.

**Nice pitch. Now show me what the agent actually does.**

A screen that can't tell “no data” from “the request failed.”<br>
Ten alleged bugs that fall apart when you follow the code.<br>
Green tests. Missing data the moment you reopen the page.

These skills spell out **what to read → what to check → what evidence to leave behind** when those problems show up.

This is not expertise in a bottle. It's a set of procedures an agent can try to follow. Less interest in impressive role descriptions. More interest in **actions it must not skip and evidence it needs before saying “done.”**

## Pick a problem

### 01 / The screen loaded. Now what?

- [**ux-state-review**](skills/ux-state-review/SKILL.md) — Distinguish loading, unmet prerequisites, empty results, and failures. Check what the user sees and can do next.
- [**exploratory-ux-qa**](skills/exploratory-ux-qa/SKILL.md) — Explore user journeys in a real browser and retain screen and network evidence.
- [**browser-e2e-review**](skills/browser-e2e-review/SKILL.md) — Include processing, failure, recovery, and visual changes in E2E review.

### 02 / More reviewers won't fix missing evidence.

- [**review-orchestrator**](skills/review-orchestrator/SKILL.md) — Classify change risk and select relevant specialist reviews. Finding count is not a quality metric.
- [**review-verifier**](skills/review-verifier/SKILL.md) — Recheck findings against original sources and counterevidence. An AI saying “bug” doesn't make it one.
- [**review-explainer**](skills/review-explainer/SKILL.md) — Connect causes, state, and before/after behavior so someone unfamiliar with the project can understand the review.

### 03 / Clicking the button once isn't a test strategy.

- [**testing**](skills/testing/SKILL.md) — Choose valuable unit, integration, mock, and database testing procedures by contract and risk, not coverage targets. Available as the [testing pack](packs/testing-pack.json).
- [**test-behavior-flows**](skills/test-behavior-flows/SKILL.md) — Verify connected behavior across interactions, asynchronous work, recovery, and data consistency.
- [**review-failure-resilience**](skills/review-failure-resilience/SKILL.md) — Review timeouts, retries, duplicate effects, partial failures, and recovery paths.
- [**web-operations-qa**](skills/web-operations-qa/SKILL.md) — Investigate production performance, caches, API latency, and background work using actual evidence.

### 04 / “Done” is doing a lot of work in that sentence.

- [**development-status**](skills/development-status/SKILL.md) — Turn change, verification, and deployment evidence into a clear account of progress and decisions needed.
- [**preserve-decisions**](skills/preserve-decisions/SKILL.md) — Carry scope, decisions, evidence, and uncertainty into the next task or session.
- [**langfuse-trace-review**](skills/langfuse-trace-review/SKILL.md) — Inspect actual requests, responses, tool results, and the limits of the trace sample.

**[Browse all skills →](skills/)** · **[Browse packs →](packs/)**

This is a problem-first entry point, not the entire catalog. Book-derived workflows and imported skills are credited below.

## Standalone pack: UML and object design

[**object-design**](skills/object-design/SKILL.md) · [**Pack definition**](packs/object-design-pack.json) · [Specialist guide](docs/object-design.md)

Select self-contained procedures connecting user goals, concepts, contracts, responsibilities, collaborations, architecture and verification. No other pack is required.

## One empty screen. Four different situations.

| State | What the interface should do |
| --- | --- |
| Still loading | Show progress. Don't declare the result empty. |
| Successfully loaded, no results | Offer a way to create the first item or change the search. |
| Missing permission | Explain the required access and the available next action. |
| Request failed | Acknowledge the failure and offer a retry when it can help. |

**Clicking “Retry” doesn't magically grant permission.**

[`ux-state-review`](skills/ux-state-review/SKILL.md) checks whether the copy, interface, requests, and transitions agree about the state—not just whether a button looks right.

## Use it

**No installation needed to read a skill.** Open any `SKILL.md` linked above.

For the owner's current personal catalog, approve a connection at
[skillar.sh/connections](https://skillar.sh/connections/) and use the skillar MCP
at `https://skillar.sh/mcp`. Edit and publish versions at
[skillar.sh/skills](https://skillar.sh/skills/).

For the retained local catalog, follow [skillar's runtime connection guides](https://github.com/changeroa/skillar#get-started). The npm setup serves local files separately. Pushing this repository does not publish personal skill versions to skillar.sh or reactivate the legacy publisher.

Example request for a connected agent:

> Find and read ux-state-review on Skillar. Review this signup flow's loading, verification-pending, failure, and re-entry states. Separate verified evidence from unchecked assumptions.

Keep a hosted skill and its supporting material pinned to the same version digest; use a commit for the retained local catalog. Skills are instructions, not permission grants. Your environment still controls tool access and execution authority.

## Contribute a skill

Skip the “You are the world's greatest expert” preamble. Give us:

1. **When to use it.** Applicable situations—and situations it should stay out of.
2. **What to do.** A procedure connecting inputs, state, actions, and outcomes.
3. **How to verify it.** Completion evidence and explicit limits on what was checked.
4. **Where it came from.** References, upstream sources, and the scope of your changes.

```sh
git clone https://github.com/changeroa/iyen-skills.git
cd iyen-skills
npm ci
npm run validate
npm test
```

The validator checks discovery rules such as frontmatter, matching names and directories, file counts, and size limits. **Passing format validation does not prove a skill is effective.** See the [technical reference](docs/technical-reference.md) for detailed limits and server integration test configuration.

## Don't erase the people you learned from.

Not every skill in this repository was created here from scratch.

- **Paperthin:** Imported skills including `re0`, `hate`, `feynman`, and `mandela` originate from [LilMGenius/paperthin](https://github.com/LilMGenius/paperthin). They are not included in the featured selection above. Their authors' work is not presented as this project's original invention.
- **Book-derived workflows:** The `clean-code` family and `dont-make-me-think` draw on the books and principles identified in their skill files. They are not official products or endorsements from those authors.
- **Import records:** [migration/import.json](migration/import.json) records original resource URIs. [aliases.json](aliases.json) records adopted URI mappings. A URI record alone does not establish copyright or licensing terms.

Check each item's provenance and applicable terms before reuse. Importing content and publishing it to a live server are separate operations.

---

**Instructions you can read. Results you can check.**

[skillar](https://github.com/changeroa/skillar) · [All skills](skills/) · [Quality](docs/quality.md) · [Releases](docs/releases.md) · [Issues](https://github.com/changeroa/iyen-skills/issues)
