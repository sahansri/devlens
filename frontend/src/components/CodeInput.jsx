
import { FileCode2, Play, RotateCcw } from "lucide-react";

export default function CodeInput({
  source,
  setSource,
  filename,
  setFilename,
  onAnalyze,
  loading,
}) {
  const lineCount = source.split("\n").length;

  function loadSample() {
    setFilename("example.js");
    setSource(`function calculateTotal(price, quantity) {
  var total = price * quantity;
  console.log("Calculating total");

  if (total == 100) {
    debugger;
  }

  return total;
}

const result = calculateTotal(10, 10);
console.log(result);`);
  }

  return (
    <section className="panel editor-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">SOURCE ANALYSIS</span>
          <h2>Analyze your code</h2>
          <p className="muted">
            Inspect your JavaScript for selected code-quality issues.
          </p>
        </div>

        <button
          className="button button-secondary"
          onClick={loadSample}
          type="button"
        >
          <RotateCcw size={15} />
          Load sample
        </button>
      </div>

      <label className="field-label" htmlFor="filename">
        File name
      </label>

      <input
        id="filename"
        className="text-input filename-input"
        value={filename}
        onChange={(event) => setFilename(event.target.value)}
        maxLength={255}
        placeholder="example.js"
      />

      <div className="editor-toolbar">
        <div className="file-tab">
          <FileCode2 size={16} />
          <span>{filename || "untitled.js"}</span>
        </div>

        <span className="muted small-text">
          {lineCount} lines · JavaScript
        </span>
      </div>

      <div className="code-editor">
        <div className="line-numbers" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>

        <textarea
          aria-label="JavaScript source code"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="code-textarea"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="// Paste your JavaScript code here..."
        />
      </div>

      <div className="editor-footer">
        <span className="muted small-text">
          Maximum 50,000 characters
        </span>

        <button
          className="button button-primary"
          onClick={onAnalyze}
          disabled={loading || !source.trim()}
          type="button"
        >
          <Play size={16} fill="currentColor" />
          {loading ? "Analyzing..." : "Analyze code"}
        </button>
      </div>
    </section>
  );
}
