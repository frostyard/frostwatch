# Spec: Unavailable baseline

This contract governs the buildable skeleton, privacy guard and CI gate. It does not define the future Watch wire service, configuration format or database schema.

## Interface

| Surface | Implemented behavior |
| --- | --- |
| `watch.Client` | Zero-value client with 7 methods, each `func(context.Context) error` |
| Read placeholders | ListResources, GetResource, QueryMetric, ListAlerts, GetAlert, GetSourceStatus |
| Display placeholder | AcknowledgeAlert; unavailable and not an agent/CLI operation |
| `internal/rpc.Unimplemented` | Returns a Connect error through hearth's error adapter |
| `frostwatchd` | Writes a fixed unavailable error to stderr, exits 1 |
| `watchctl` | Default invocation calls the SDK, returns unavailable, exits 1 |
| `watchctl --help` | Shows help without backend access |
| `web/index.html` | Says `Not implemented. Alert status unavailable.` |

These Go signatures are deliberately provisional. The protocol phase replaces them with generated request/response types; no wire route, proto, migration or runtime configuration is defined here.

## Rules

- Every skeleton SDK method and handler MUST return Connect `Unimplemented`, including when its context is cancelled. It MUST NOT return successful empty data.
- Both commands MUST NOT open a socket, backend connection or state file in this skeleton.
- The web skeleton MUST contain no executable script or remote resource. It MUST NOT show health, all-clear, acknowledgement or sound controls.
- Go MUST be pinned to 1.27.4 only in `go.mod`. The dependency graph MUST retain hearth v0.2.0 with a non-test import. Other tools MUST be pinned through mise with checksums.
- `make verify` MUST run canonical instructions, docs index, risk and correction validation; Node regression tests; privacy; tidy; vet; formatting; lint; and unfiltered Go tests. The tests MUST enforce the exact SDK method set and require `policies/agent-governance.json` with default deny, protected boundaries and human-review controls.
- `make check` MUST format then verify. `make ci` MUST add builds, race and cross-builds. With a nonempty BASE it MUST also reject correction deletion, renaming and changes other than filling empty `promoted_to`.
- CI MUST retain the `verify` check and produce `CI result` on pull requests and merge groups. The latter MUST fail if verification fails, is cancelled or is skipped. The owner MUST require both before merge.
- Privacy scanning MUST examine tracked and new non-ignored files. It MUST refuse unexpected symlinks, binary files, common private DNS/address patterns, credentials and raw workload labels. Canonical instruction aliases are validated separately.
- URLs in `testdata/fictional/` MUST use `.invalid`. Fixtures MUST be fictional; scanner success alone cannot establish this.
- Private inventory, host names, addresses, logs, credentials, workload content and agent paths MUST NOT enter public files. Human review MUST verify provenance as well as scanner results.

## Derived artifacts

| Artifact | Derivation |
| --- | --- |
| `go.sum` | Go module resolution and `go mod tidy` |
| `mise.lock` | `mise lock` from `go.mod` and `mise.toml` |
| `build/frostwatchd`, `build/watchctl` | `make build`; ignored, not release artifacts |

## References

- Rationale: [ADR-0004](../adr/0004-build-an-unavailable-sdk-first-baseline.md).
- Context: [baseline design](../design/overview.md).
- Order: [roadmap](../plans/0001-roadmap.md).
