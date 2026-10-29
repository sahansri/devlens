
import { Clock3, FileCode2, ChevronRight, RefreshCw } from "lucide-react";

function formatDate(value) {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function HistoryList({
  analyses = [],
  selectedId,
  onSelect,
  onRefresh,
  loading,
}) {
  return (
    <section className="panel history-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">RECENT ACTIVITY</span>
          <h2>Analysis history</h2>
          <p className="muted">Your latest saved analyses</p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh analysis history"
          title="Refresh history"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {loading && analyses.length === 0 ? (
        <p className="muted history-message">Loading history...</p>
      ) : analyses.length === 0 ? (
        <div className="history-empty">
          <Clock3 size={25} />
          <p>No saved analyses yet.</p>
          <span className="muted small-text">
            Your completed analyses will appear here.
          </span>
        </div>
      ) : (
        <div className="history-list">
          {analyses.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`history-item ${
                String(selectedId) === String(item.id)
                  ? "history-item-active"
                  : ""
              }`}
              onClick={() => onSelect(item)}
            >
              <span className="history-file-icon">
                <FileCode2 size={19} />
              </span>

              <span className="history-details">
                <span className="history-filename">
                  {item.filename || "untitled.js"}
                </span>

                <span className="history-meta">
                  {formatDate(item.created_at)}
                </span>

                <span className="history-meta">
                  {item.total_lines} lines · {item.total_issues} findings
                </span>
              </span>

              <ChevronRight size={17} className="history-chevron" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
