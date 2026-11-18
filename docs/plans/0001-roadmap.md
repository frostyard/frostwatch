# Plan: Frostwatch delivery boundaries

This roadmap separates the buildable baseline from runtime delivery. It records no deployment permission. The [baseline design](../design/overview.md) describes only the current skeleton; [ADR-0004](../adr/0004-build-an-unavailable-sdk-first-baseline.md) fixes its unavailable behavior.

## Phase 1 — Repository and unavailable skeleton

- Add pinned Go/hearth, SDK, CLI, daemon and inert web skeletons under the [baseline spec](../specs/baseline.md). The exact reads are ListResources, GetResource, QueryMetric, ListAlerts, GetAlert and GetSourceStatus; AcknowledgeAlert is the only display placeholder.
- Preserve baseline governance, including the deny-by-default `policies/agent-governance.json` and its regression check. Add privacy regression tests plus the exact `CI result` aggregator beside `verify`.
- Index the design, decision, spec and roadmap with reciprocal links.
- **Done when:** `make ci BASE=origin/main` passes, all 7 SDK placeholders and the adapter return Connect `Unimplemented`, both commands build, and the owner requires both observed GitHub check contexts before merge. Local completion alone does not establish the GitHub settings outcome.

## Phase 2 — Typed protocol and generated boundary

- Replace provisional signatures with the approved typed 7-RPC service and generated wrappers/manifests. This is separate from the [baseline spec](../specs/baseline.md); add the implemented protocol spec with the code.
- **Done when:** generated-code drift checks and protocol/authorization contract tests pass without broadening the 6 reads and UI-only display acknowledgement.

## Phase 3 — Runtime and delivery

- Build storage, bounded backend reads, alert reconciliation, read-only MCP and the lodge UI in separately reviewed changes. Extend the [design](../design/overview.md) and specs with implemented behavior.
- Keep packaging, state recovery, release, deployment and commissioning separately gated. This skeleton implements none of them.
- **Done when:** each implemented contract passes its runtime, privacy and recovery tests, and independent delivery approvals and commissioning evidence satisfy its own acceptance conditions.

## Later / ideas

No additional API, collector, host-control or dataset scope is authorized by this roadmap.

## Open questions

None for the baseline. GitHub required-check configuration remains an owner action, not an implementation choice.

## References

- Implements: [baseline design](../design/overview.md), [baseline spec](../specs/baseline.md).
- Rationale: [ADR-0004](../adr/0004-build-an-unavailable-sdk-first-baseline.md).
