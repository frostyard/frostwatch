#!/usr/bin/env node
// Repository privacy guard. Report rule IDs, never the matching content.
import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { isIP } from "node:net";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rules = [
  ["private-dns", /\b[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\.(?:ts\.net|local|lan|internal)\b/iu],
  ["agent-path", /\/(?:var\/)?home\/(?!example(?:\/|\b))[^\s/]+\/(?:agents|\.pi|\.config|\.local)(?:\/|\b)/u],
  ["private-key", /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/u],
  ["credential", /\b(?:password|api[_-]?key|client[_-]?secret|access[_-]?token)\s*[=:]\s*["']?[^\s"'<>]{8,}/iu],
  ["bearer", /\bBearer\s+[a-z0-9_.~-]{12,}/iu],
  ["mac-address", /\b(?:[a-f0-9]{2}:){5}[a-f0-9]{2}\b/iu],
  ["raw-workload-label", new RegExp(String.raw`\b(?:${["container_" + "label_", "pod_" + "annotation_", "process_" + "command_line", "process_" + "environ"].join("|")})[a-z0-9_]*`, "iu")],
];

export function scanText(text, { fixture = false } = {}) {
  const found = new Set();
  for (const [code, pattern] of rules) if (pattern.test(text)) found.add(code);
  for (const match of text.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/gu)) {
    const ip = match[0];
    if (!isIP(ip)) continue;
    const [a, b, c] = ip.split(".").map(Number);
    if (a === 127 || (a === 192 && b === 0 && c === 2) ||
        (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113)) continue;
    found.add("non-documentation-ip");
  }
  for (const token of text.split(/[\s"'`<>()\[\],;]+/u)) {
    if (isIP(token) === 6 && token !== "::1" && !token.toLowerCase().startsWith("2001:db8:")) {
      found.add("non-documentation-ip");
    }
  }
  for (const match of text.matchAll(/https?:\/\/[^\s"'`<>]+/gu)) {
    let url;
    try { url = new URL(match[0]); } catch { found.add("invalid-url"); continue; }
    if (url.username || url.password) found.add("url-credential");
    if (fixture && !url.hostname.endsWith(".invalid")) found.add("fixture-endpoint");
    const hostname = url.hostname.replace(/^\[|\]$/gu, "");
    if (isIP(hostname) === 6 && hostname !== "::1" && !hostname.startsWith("2001:db8:")) {
      found.add("non-documentation-ip");
    }
  }
  return [...found].sort();
}

export function checkRepository(root) {
  const files = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    cwd: root, encoding: "utf8",
  }).split("\0").filter(Boolean);
  const aliases = new Set(["CLAUDE.md", "GEMINI.md", ".cursorrules", ".github/copilot-instructions.md", ".claude/skills"]);
  const failures = [];
  for (const file of new Set(files)) {
    const path = resolve(root, file);
    let stat;
    try { stat = lstatSync(path); } catch (error) {
      if (error.code === "ENOENT") continue; // Tracked deletion.
      throw error;
    }
    if (stat.isSymbolicLink()) {
      if (!aliases.has(file)) failures.push([file, ["unexpected-symlink"]]);
      continue;
    }
    if (!stat.isFile()) { failures.push([file, ["unexpected-file-type"]]); continue; }
    const bytes = readFileSync(path);
    const codes = bytes.includes(0) ? ["binary-file"] : scanText(bytes.toString("utf8"), {
      fixture: file.startsWith("testdata/fictional/"),
    });
    if (codes.length) failures.push([file, codes]);
  }
  return { files: new Set(files).size, failures };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 2) {
    console.error("Usage: node scripts/check-privacy.mjs");
    process.exitCode = 2;
  } else {
    try {
      const result = checkRepository(resolve(fileURLToPath(new URL("..", import.meta.url))));
      for (const [file, codes] of result.failures) console.error(`privacy: ${JSON.stringify(file)}: ${codes.join(", ")}`);
      console.log(`privacy: ${result.files} files; ${result.failures.length} failures`);
      if (result.failures.length) process.exitCode = 1;
    } catch {
      console.error("privacy: repository scan failed");
      process.exitCode = 1;
    }
  }
}
