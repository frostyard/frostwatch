import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../web/index.html", import.meta.url), "utf8");
test("web skeleton is explicit, responsive and inert", () => {
  assert.match(html, /name="viewport"/u);
  assert.match(html, /Alert status unavailable/u);
  assert.match(html, /default-src 'none'/u);
  assert.match(html, /form-action 'none'/u);
  assert.match(html, /<main>/u);
  assert.doesNotMatch(html, /<(?:script|form|audio|iframe|img|link)\b/iu);
  assert.doesNotMatch(html, /\b(?:src|href|on\w+)\s*=/iu);
});
