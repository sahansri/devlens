
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Code2,
  GitBranch,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { analyzeSource, getAnalyses } from "../api/analyses";
import CodeInput from "../components/CodeInput";
import SummaryCards from "../components/SummaryCards";
import FindingsTable from "../components/FindingsTable";
import HistoryList from "../components/HistoryList";

const INITIAL_SOURCE = `function calculateTotal(price, quantity) {
  var total = price * quantity;
  console.log("Calculating total");

  if (total == 100) {
    debugger;
  }

  return total;
}

const result = calculateTotal(10, 10);
console.log(result);`;

export default function Dashboard() {
  const [source, setSource] = useState(INITIAL_SOURCE);
  const [filename, setFilename] = useState("example.js");

  const [result, setResult] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [analyses, setAnalyses] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true);

    try {
      const data = await getAnalyses();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected history response.");
      }

      setAnalyses(data);
    } catch (err) {
      setError(`Could not load history: ${err.message}`);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  async function handleAnalyze() {
    if (!source.trim()) {
      setError("Enter some JavaScript code first.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setNotice("");

    try {
      const saved = await analyzeSource(
        source,
        filename.trim() || "untitled.js"
      );

      setResult({
        total_lines: saved.total_lines,
        total_issues: saved.total_issues,
        findings: saved.findings,
      });

      setSelectedId(saved.id);
      setNotice("Analysis completed and saved successfully.");

      await refreshHistory();
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleSelectAnalysis(item) {
    setResult({
      total_lines: item.total_lines,
      total_issues: item.total_issues,
      findings: Array.isArray(item.findings) ? item.findings : [],
    });

    setFilename(item.filename || "untitled.js");
    setSelectedId(item.id);
    setError("");
    setNotice(
      "Viewing a saved result. The original source code is not reloaded in this editor."
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="DevLens home">
          <span className="brand-icon">
            <Code2 size={23} />
          </span>

          <span className="brand-text">
            <strong>DevLens</strong>
            <span>Code quality workspace</span>
          </span>
        </a>

        <div className="topbar-right">
          <span className="connection-indicator">
            <span className="status-dot" />
            Analysis workspace
          </span>

          <a
            className="icon-button github-link"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="Add your project repository link here"
          >
            <GitBranch size={19} />
          </a>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="welcome-section">
          <div>
            <div className="welcome-kicker">
              <Activity size={15} />
              DEVELOPER TOOLKIT
            </div>

            <h1>Code quality, <span>in focus.</span></h1>

            <p className="welcome-description">
              Analyze JavaScript, review potential code-quality issues,
              and track your previous analyses in one workspace.
            </p>
          </div>

          <div className="welcome-badge">
            <ShieldCheck size={18} />
            <span>Rule-based analysis</span>
          </div>
        </section>

        {error && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>

            <button
              type="button"
              className="alert-close"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {notice && (
          <div className="alert alert-success" role="status">
            <span>{notice}</span>

            <button
              type="button"
              className="alert-close"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <div className="workspace-grid">
          <div className="main-column">
            <CodeInput
              source={source}
              setSource={setSource}
              filename={filename}
              setFilename={setFilename}
              onAnalyze={handleAnalyze}
              loading={analyzing}
            />

            <SummaryCards result={result} />

            <FindingsTable findings={result?.findings ?? []} />
          </div>

          <aside className="sidebar-column">
            <HistoryList
              analyses={analyses}
              selectedId={selectedId}
              onSelect={handleSelectAnalysis}
              onRefresh={refreshHistory}
              loading={historyLoading}
            />

            <section className="panel info-panel">
              <div className="info-icon">
                <ShieldCheck size={20} />
              </div>

              <h3>About this analyzer</h3>

              <p>
                DevLens checks selected JavaScript patterns. Findings
                indicate potential concerns, not confirmed bugs.
              </p>

              <div className="info-divider" />

              <p className="muted small-text">
                Tip: Try the sample code to see how the findings and
                line numbers work.
              </p>
            </section>
          </aside>
        </div>

        <footer className="app-footer">
          <span>DevLens · Built for developer productivity</span>
          <button
            type="button"
            className="footer-refresh"
            onClick={refreshHistory}
            disabled={historyLoading}
          >
            <RefreshCw size={13} />
            Refresh history
          </button>
        </footer>
      </main>
    </div>
  );
}
