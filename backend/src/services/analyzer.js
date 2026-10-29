
const rules = [
  {
    id: "debugger-statement",
    severity: "warning",
    title: "Debugger statement",
    pattern: /\bdebugger\s*;?/,
    explanation: "Remove debugging statements before production."
  },
  {
    id: "console-log",
    severity: "info",
    title: "Console logging",
    pattern: /\bconsole\.log\s*\(/,
    explanation: "Review whether this log is needed in production."
  },
  {
    id: "loose-equality",
    severity: "warning",
    title: "Loose equality",
    pattern: /(^|[^=!])==(?!=)|!=(?!=)/,
    explanation: "Review whether strict equality is more appropriate."
  },
  {
    id: "eval-usage",
    severity: "warning",
    title: "Dynamic code evaluation",
    pattern: /\beval\s*\(/,
    explanation: "Review the security and maintainability risks."
  },
  {
    id: "var-declaration",
    severity: "info",
    title: "var declaration",
    pattern: /\bvar\s+[A-Za-z_$]/,
    explanation: "Consider whether let or const better expresses intent."
  }
];

export function analyzeCode(source) {
  if (typeof source !== "string" || !source.trim()) {
    throw new Error("Source code is required.");
  }

  if (source.length > 50000) {
    throw new Error("Source code must be 50,000 characters or less.");
  }

  const findings = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        findings.push({
          id: rule.id,
          severity: rule.severity,
          title: rule.title,
          line: index + 1,
          explanation: rule.explanation,
          snippet: line.trim().slice(0, 200)
        });
      }
    }
  });

  return {
    totalLines: lines.length,
    totalIssues: findings.length,
    findings
  };
}
