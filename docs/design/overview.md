# Frostwatch baseline

Living document. Rationale: [ADR-0004](../adr/0004-build-an-unavailable-sdk-first-baseline.md).
Contracts: [baseline spec](../specs/baseline.md).

## Overview

Frostwatch currently provides an unavailable SDK, CLI and daemon skeleton plus an inert web page. It performs no monitoring and stores no data. The implemented call path is:

```text
watchctl -> internal/cli -> watch.Client -> internal/rpc.Unimplemented
frostwatchd -----------------------------> internal/rpc.Unimplemented
web/index.html -> static unavailable message
```

## Design

- `watch/` exposes the public SDK boundary. Its exact reads are ListResources, GetResource, QueryMetric, ListAlerts, GetAlert and GetSourceStatus; AcknowledgeAlert is the only display placeholder. These 7 context-only methods are provisional and return only errors. They neither accept nor expose wire payloads.
- `internal/rpc/` reserves the adapter boundary and preserves Connect `Unimplemented` through hearth v0.2.0's error adapter. It has no routing or generated service.
- `internal/cli/` holds a fresh Cobra command over the SDK. `cmd/watchctl/` runs it with clix. It has no acknowledgement command.
- `cmd/frostwatchd/` reserves the binary name. It exits nonzero without configuration or socket access.
- `web/` has one static page with a network-denying CSP, no script, no audio and an explicit unavailable alert state. There is no JavaScript dependency manifest yet.
- `testdata/fictional/` holds illustrative public fixture data, not a supported configuration schema. All endpoint URLs there use `.invalid`.

The eventual app architecture uses one daemon for configured Prometheus and Alertmanager sources, a generated 7-RPC Watch service and hearth authorization. The sole selector is scope; resource parents do not confer permissions. Acknowledgement remains UI-only display state. Source measurement time is distinct from collection, arrival and recording time. No current component implements those runtime claims.

The remaining runtime, database, generated wrappers/manifests, backend queries, alert reconciliation, MCP, lodge UI and packaging belong to later phases. There is no telemetry collector or host-control path in this skeleton.

## Operational notes

Use `mise install`, then `make ci BASE=origin/main`. Both binaries currently fail deliberately. Do not use them as a health probe or production service.

`make verify` runs the template validators, Node regression tests, privacy scan, module tidiness, vet, formatting check, pinned lint and unfiltered Go tests. `make ci` adds pure-Go command builds, race tests, Linux amd64/arm64 cross-builds and base-relative correction checks when BASE is nonempty. Tool installation and first module resolution can require public network access; unit tests do not.

`policies/agent-governance.json` retains core's default deny, human review before merge, independent exception approval and highest-applicable risk controls. Its protected paths name only existing repository surfaces. The baseline tests require this file and validate those controls.

CI retains `verify` and adds `CI result`. The aggregator requires successful verification even if its dependency is cancelled or skipped. GitHub required-check configuration is an owner action, not repository automation.

The privacy scan includes tracked files and new non-ignored files. It skips only canonical instruction aliases, refuses other symlinks and binary files, checks common credential/private-address/content patterns and requires `.invalid` fixture URLs. It reports file names and rule IDs, never matching content. This is a guard, not a complete secret detector or proof of fictional provenance.

## References

- Rationale: [ADR-0004](../adr/0004-build-an-unavailable-sdk-first-baseline.md).
- Contracts: [baseline spec](../specs/baseline.md).
- Built in: [roadmap — Phase 1](../plans/0001-roadmap.md#phase-1--repository-and-unavailable-skeleton).
