<!-- readme-kind: service -->
# Frostwatch

Frostwatch is a planned tailnet monitoring app for lodge. It will show authorized resource, metric and alert reads from configured Prometheus and Alertmanager sources.

**Status:** baseline skeleton only. No daemon listener, backend access, database, protocol, MCP, packaging or deployment exists. Both binaries fail with Connect `Unimplemented`; the static web page says alert status is unavailable.

**Documentation:** [docs/README.md](docs/README.md)

## What it does

- **Buildable SDK boundary.** The public `watch` package names exactly 6 reads: ListResources, GetResource, QueryMetric, ListAlerts, GetAlert and GetSourceStatus. AcknowledgeAlert is the only display placeholder. Every provisional method returns `Unimplemented` without reading files or making requests.
- **Thin CLI skeleton.** `watchctl` uses the SDK and clix. It has help and version metadata, not working monitoring commands.
- **Privacy and baseline checks.** Local and GitHub gates check fictional fixtures, pinned dependencies, canonical instructions, indexed docs, risk paths and permanent correction records.

## Interface

| Surface | Current behavior |
| --- | --- |
| `watch.Client` | All 7 context-only placeholders return `Unimplemented` |
| `frostwatchd` | Returns `Unimplemented`, exits nonzero, opens no listener |
| `watchctl` | Returns `Unimplemented`, exits nonzero; help remains available |
| `web/index.html` | Static unavailable state, no script or network resources |

The [baseline spec](docs/specs/baseline.md) describes the implemented boundary. There is no wire/API compatibility promise yet. The protocol phase replaces these placeholder signatures with generated typed interfaces.

## Deploy

Do not deploy this baseline. No package, service unit, release workflow or installation path is implemented. `watch` is the reserved lodge app key; `frostyard-frostwatch` is only the planned Debian package name. Future packaging and runtime acceptance remain separate work in the [roadmap](docs/plans/0001-roadmap.md).

## Develop

```sh
mise install
make ci BASE=origin/main
```

Go 1.27.4 is pinned only in `go.mod`; mise reads it there. `mise.toml` and `mise.lock` pin the other tools. `make check` formats first; `make verify` is read-only; `make ci` adds builds, race tests, cross-builds and base-relative correction validation.

CI produces both **`verify`** and **`CI result`**. The owner must require both on the default branch before merge. This repository does not change GitHub settings automatically.

## Where to go next

- [AGENTS.md](AGENTS.md): contributor and agent rules.
- [docs/README.md](docs/README.md): decisions, design, specs and roadmap.
- [SECURITY.md](SECURITY.md): report a vulnerability privately.
- [LICENSE](LICENSE): MIT.
