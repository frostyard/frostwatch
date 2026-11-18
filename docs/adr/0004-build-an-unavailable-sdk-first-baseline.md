# 0004 — Build an unavailable SDK-first baseline

- **Status:** Accepted
- **Date:** 2026-11-17

## Context

Frostwatch needs a buildable repository boundary before its protocol, storage and backend work. A skeleton must not return invented inventory, zero metrics or an all-clear state. Public source must contain no installation inventory, credentials or workload content.

## Decision

Use module `github.com/frostyard/frostwatch`, public package `watch`, daemon `frostwatchd`, CLI `watchctl` and lodge app key `watch`. Pin Go 1.27.4 in `go.mod` and hearth v0.2.0 in the module graph. Keep a real hearth adapter import so module tidying cannot discard the toolkit. Build the CLI with clix over the public SDK.

Reserve exactly 7 operations: ListResources, GetResource, QueryMetric, ListAlerts, GetAlert, GetSourceStatus and AcknowledgeAlert. The first 6 are reads; acknowledgement is future UI-only display state. No acknowledgement CLI or MCP tool is authorized. It must never silence Alertmanager, change notifications or establish recovery.

At this baseline, use context-only Go stubs returning Connect `Unimplemented`. Do not define a wire schema or start listeners. The later protocol phase owns generated types, manifests and wrappers. The static web skeleton must say unavailable and load nothing from the network.

The eventual daemon reads only configured backends. Caller text cannot select a URL or raw query. Authorization must precede counts, cache access and backend selection. Private installation configuration belongs outside this public repository. Missing, stale, unsupported and unverified values are not measured zero or healthy values. Selected controller observations retain UNKNOWN timing and UNVERIFIED values; dataset API detail is excluded. Unqualified native NAS families publish no numeric value. These are future implementation constraints, not capabilities implemented here.

Keep the existing `verify` check and add `CI result`, failing for failed, cancelled or skipped required work. The owner must require both before merge. Preserve canonical instruction aliases, pinned actions, least privilege, permanent corrections and risk validation.

## Consequences

The baseline builds and tests without a running backend or credentials. Review can distinguish placeholder code from functioning monitoring. Provisional Go signatures will change during protocol generation; they are not a stable SDK release.

Privacy scanning catches known unsafe patterns but cannot prove that arbitrary text is fictional. Human diff review remains mandatory. No release, package, deployment, backend, acknowledgement implementation or MCP is part of this decision's baseline delivery.

## Alternatives considered

- **Generate the protocol in the baseline:** rejected to keep the protocol and authorization review separate.
- **Return empty successful responses:** rejected because missing alert data must not imply all-clear.
- **Copy another app's implementation:** rejected; hearth supplies shared transport and authorization boundaries without importing an unrelated application.

## References

- Shapes: [baseline design](../design/overview.md), [baseline spec](../specs/baseline.md), [roadmap](../plans/0001-roadmap.md).
- Builds on: [ADR-0003](0003-verify-gate-risk-paths-and-corrections.md).
- Toolkit: [hearth v0.2.0](https://github.com/frostyard/hearth/tree/v0.2.0).
- SDK-first pattern: [frostmarks](https://github.com/frostyard/frostmarks).
- Baseline: [core repository baseline](https://github.com/frostyard/core/blob/main/docs/specs/repository-baseline.md).
