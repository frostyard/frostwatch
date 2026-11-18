.DEFAULT_GOAL := verify

NODE_MAJOR := $(shell node -p "process.versions.node.split('.')[0]" 2>/dev/null)
GOLANGCI_LINT_VERSION := $(shell awk -F '"' '/^golangci-lint = / {print $$2}' mise.toml)
GO_FILES = $(shell git ls-files --cached --others --exclude-standard '*.go' | while read -r f; do [ ! -f "$$f" ] || echo "$$f"; done)

.PHONY: verify check ci fmt lint test build race cross privacy web-check

fmt:
	gofmt -w $(GO_FILES)

lint:
	@test "$$(golangci-lint version --short)" = "$(GOLANGCI_LINT_VERSION)" || { echo "install pinned tools with mise install"; exit 1; }
	golangci-lint run

test:
	go test ./...

build:
	CGO_ENABLED=0 go build -trimpath -o build/ ./cmd/...

race:
	CGO_ENABLED=1 go test -race ./...

cross:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build ./...
	CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build ./...

privacy:
	node scripts/check-privacy.mjs

web-check:
	node --test test/web.test.mjs

verify:
	@test -n "$(NODE_MAJOR)" && [ "$(NODE_MAJOR)" -ge 22 ] || { echo "Node >=22 is required (mise install)"; exit 1; }
	node scripts/check-template.mjs
	node --test test/*.test.mjs
	$(MAKE) --no-print-directory privacy
	go mod tidy -diff
	go vet ./...
	@test -z "$$(gofmt -l $(GO_FILES))" || { echo "run make fmt"; exit 1; }
	$(MAKE) --no-print-directory lint test

check: fmt verify

ci: verify build race cross
	@if [ -n "$(BASE)" ]; then node scripts/check-corrections.mjs --base "$(BASE)"; fi
