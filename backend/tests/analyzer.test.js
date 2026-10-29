
import test from "node:test";
import assert from "node:assert/strict";
import { analyzeCode } from "../src/services/analyzer.js";

test("detects debugger and console logging", () => {
  const result = analyzeCode(
    "console.log('hello');\ndebugger;"
  );

  assert.equal(result.totalLines, 2);
  assert.equal(result.totalIssues, 2);
  assert.deepEqual(
    result.findings.map(f => f.line),
    [1, 2]
  );
});

test("reports no findings for clean sample code", () => {
  const result = analyzeCode(
    "const total = 10;\nconst active = true;"
  );

  assert.equal(result.totalIssues, 0);
});

test("rejects empty source code", () => {
  assert.throws(() => analyzeCode("  "), /required/i);
});
