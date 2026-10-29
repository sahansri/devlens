
import { useMemo, useState } from "react";
import { Search, ListFilter, CheckCircle2 } from "lucide-react";

export default function FindingsTable({ findings = [] }) {
  const [severity, setSeverity] = useState("all");
  const [search, setSearch] = useState("");

  const filteredFindings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return findings.filter((finding) => {
      const matchesSeverity =
        severity === "all" || finding.severity === severity;

      const matchesSearch =
        !query ||
        finding.title?.toLowerCase().includes(query) ||
        finding.explanation?.toLowerCase().includes(query) ||
        finding.id?.toLowerCase().includes(query);

      return matchesSeverity && matchesSearch;
    });
  }, [findings, severity, search]);

  return (
    <section className="panel findings-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">ANALYSIS RESULTS</span>
          <h2>Findings</h2>
          <p className="muted">
            {filteredFindings.length} of {findings.length} findings
          </p>
        </div>

        <span className="results-count">{findings.length}</span>
      </div>

      <div className="filters-row">
        <div className="search-box">
          <Search size={16} />
          <input
            aria-label="Search findings"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search findings..."
          />
        </div>

        <div className="select-wrapper">
          <ListFilter size={15} />
          <select
            aria-label="Filter by severity"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="all">All severities</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {filteredFindings.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 size={32} />
          <h3>
            {findings.length === 0
              ? "No findings to display"
              : "No matching findings"}
          </h3>
          <p className="muted">
            {findings.length === 0
              ? "Run an analysis to see the results here."
              : "Try another search term or severity filter."}
          </p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="findings-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Severity</th>
                <th>Line</th>
              </tr>
            </thead>

            <tbody>
              {filteredFindings.map((finding, index) => (
                <tr key={`${finding.id}-${finding.line}-${index}`}>
                  <td>
                    <div className="finding-title">
                      {finding.title}
                    </div>
                    <div className="finding-description">
                      {finding.explanation}
                    </div>
                    {finding.snippet && (
                      <code className="finding-snippet">
                        {finding.snippet}
                      </code>
                    )}
                  </td>

                  <td>
                    <span
                      className={`severity severity-${finding.severity}`}
                    >
                      {finding.severity}
                    </span>
                  </td>

                  <td>
                    <span className="line-badge">
                      {finding.line}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
