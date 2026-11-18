import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkRepository, scanText } from "../scripts/check-privacy.mjs";

const joinParts = (...parts) => parts.join("");

test("rejects synthetic private data without publishing a real inventory", () => {
  const cases = [
    [joinParts("metrics.", "example.", "ts.net"), "private-dns"],
    [joinParts("host.", "lan"), "private-dns"],
    [joinParts("10", ".1.2.3"), "non-documentation-ip"],
    [joinParts("100", ".64.1.2"), "non-documentation-ip"],
    [joinParts("172", ".16.0.1"), "non-documentation-ip"],
    [joinParts("192", ".168.1.2"), "non-documentation-ip"],
    [joinParts("https", "://[", "fd00", "::1]/"), "non-documentation-ip"],
    [joinParts("/var/home/", "fixture-user/agents/fixture"), "agent-path"],
    [joinParts("password", "=", "synthetic-value"), "credential"],
    [joinParts("Bearer", " ", "synthetic-token-value"), "bearer"],
    [joinParts("-----BEGIN ", "PRIVATE KEY-----"), "private-key"],
    [joinParts("https", "://", "fixture:synthetic@example.invalid"), "url-credential"],
    [joinParts("aa:bb:", "cc:dd:ee:ff"), "mac-address"],
    [joinParts("container_", "label_private"), "raw-workload-label"],
  ];
  for (const [text, code] of cases) assert.ok(scanText(text).includes(code), code);
});

test("accepts public sources, documentation addresses and fictional endpoints", () => {
  for (const text of ["", "https://github.com/frostyard/hearth", "127.0.0.1", "192.0.2.1", "2001:db8::1", "https://metrics.example.invalid"]) {
    assert.deepEqual(scanText(text), []);
  }
  assert.deepEqual(scanText("https://metrics.example.invalid", { fixture: true }), []);
  assert.ok(scanText("https://example.org", { fixture: true }).includes("fixture-endpoint"));
});

test("scans new and tracked files, refuses binary and unexpected symlinks", () => {
  const root = mkdtempSync(join(tmpdir(), "frostwatch-privacy-"));
  try {
    execFileSync("git", ["init", "--quiet", root]);
    writeFileSync(join(root, "tracked.txt"), "fictional");
    execFileSync("git", ["add", "tracked.txt"], { cwd: root });
    writeFileSync(join(root, "new.txt"), joinParts("host.", "internal"));
    writeFileSync(join(root, "bytes.bin"), Buffer.from([0, 1]));
    symlinkSync("tracked.txt", join(root, "alias.txt"));
    const result = checkRepository(root);
    assert.equal(result.files, 4);
    assert.deepEqual(result.failures.map(([file]) => file).sort(), ["alias.txt", "bytes.bin", "new.txt"]);
  } finally { rmSync(root, { recursive: true }); }
});
