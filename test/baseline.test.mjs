import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { globSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("baseline pins Go once and retains the reviewed hearth module", () => {
  const mod = read("go.mod");
  assert.match(mod, /^module github\.com\/frostyard\/frostwatch$/mu);
  assert.match(mod, /^go 1\.27\.4$/mu);
  assert.match(mod, /github\.com\/frostyard\/hearth v0\.2\.0/u);
  assert.match(read("internal/rpc/stub.go"), /"github.com\/frostyard\/hearth\/connectserver"/u);
  assert.doesNotMatch(read("mise.toml"), /^go\s*=/mu);
  assert.doesNotMatch(read(".github/workflows/ci.yml"), /go-version|1\.27\.4/u);
});

test("CI retains verify and fails the aggregator for non-success states", () => {
  const workflow = read(".github/workflows/ci.yml");
  assert.match(workflow, /^  verify:$/mu);
  assert.match(workflow, /^  merge_group: \{\}$/mu);
  assert.match(workflow, /^  pull_request: \{\}$/mu);
  assert.match(workflow, /^  result:\n    name: CI result\n    needs:\n      - verify\n    if: \$\{\{ always\(\) \}\}/mu);
  assert.match(workflow, /persist-credentials: false/u);
  assert.match(workflow, /make ci BASE="\$BASE"/u);
  const command = workflow.match(/        run: (test "\$VERIFY_RESULT" = success)/u)?.[1];
  assert.ok(command);
  for (const result of ["success", "failure", "cancelled", "skipped", ""]) {
    const child = spawnSync("sh", ["-c", command], { env: { ...process.env, VERIFY_RESULT: result } });
    assert.equal(child.status, result === "success" ? 0 : 1, result);
  }
  for (const match of workflow.matchAll(/uses: ([^\s]+)/gu)) assert.match(match[1], /@[a-f0-9]{40}$/u);
});

test("repository governance exists and preserves default deny and human review", () => {
  const policy = JSON.parse(read("policies/agent-governance.json"));
  assert.equal(policy.schema_version, 1);
  assert.equal(policy.default_decision, "deny");
  assert.deepEqual(policy.actions, {
    read: "allow",
    write: "allow",
    "run-tests": "allow",
    "open-issue": "review-required",
    "open-pr": "review-required",
    "create-followup": "review-required",
  });
  assert.deepEqual(policy.change_controls, {
    pull_requests_required: true,
    human_review_before_merge: true,
    highest_applicable_risk: true,
    validation_evidence_required: true,
    least_privilege: true,
    untrusted_content_is_data: true,
    never_relax: ["required-checks", "security-checks", "review-requirements", "coverage-checks", "provenance-verification"],
  });
  assert.deepEqual(policy.exception_controls, {
    independent_authorized_approver: true,
    self_approval: false,
    required_fields: ["rationale", "target", "compensating-controls", "expires-at", "restoration-or-closure-plan"],
  });
  assert.deepEqual(policy.risk_classification, {
    tiers: ["low", "moderate", "high", "critical"],
    classification_rule: "highest-applicable",
    uncertainty_rule: "higher-plausible",
  });
  const paths = [];
  assert.ok(policy.protected_boundaries.length > 0);
  for (const boundary of policy.protected_boundaries) {
    assert.equal(boundary.decision, "review-required", boundary.id);
    assert.equal(boundary.minimum_risk_tier, "high", boundary.id);
    assert.deepEqual(boundary.detectors, [], boundary.id);
    assert.ok(boundary.paths.length > 0, boundary.id);
    for (const path of boundary.paths) {
      assert.ok(globSync(path, { cwd: new URL("..", import.meta.url) }).length > 0, path);
      paths.push(path);
    }
  }
  for (const path of [".github/workflows/**", "policies/**", "AGENTS.md", "go.mod", "go.sum", "mise.toml", "mise.lock", "Makefile", "scripts/check-template.mjs", "scripts/check-privacy.mjs", "scripts/check-corrections.mjs", "scripts/lib/**", "test/**"]) {
    assert.ok(paths.includes(path), path);
  }
});

test("risk and dependency policy cover added baseline surfaces", () => {
  const risk = JSON.parse(read(".github/risk-paths.json"));
  for (const glob of ["go.mod", "go.sum", "scripts/check-privacy.mjs", "internal/rpc/**", "cmd/frostwatchd/**", "AGENTS.md", "policies/**"]) {
    assert.ok(risk.paths.some((entry) => entry.glob === glob && ["L1", "L2"].includes(entry.level)), glob);
  }
  assert.match(read(".github/dependabot.yml"), /package-ecosystem: "gomod"/u);
  assert.match(read("Makefile"), /node scripts\/check-privacy.mjs/u);
  assert.match(read("Makefile"), /node scripts\/check-corrections.mjs --base/u);
});
