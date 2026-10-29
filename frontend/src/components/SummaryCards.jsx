
import {
  FileCode2,
  SearchCheck,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

export default function SummaryCards({ result }) {
  const findings = result?.findings ?? [];

  const warnings = findings.filter(
    (item) => item.severity === "warning"
  ).length;

  const errors = findings.filter(
    (item) => item.severity === "error"
  ).length;

  const cards = [
    {
      label: "Lines analyzed",
      value: result?.total_lines ?? 0,
      icon: FileCode2,
      color: "blue",
    },
    {
      label: "Total findings",
      value: result?.total_issues ?? findings.length,
      icon: SearchCheck,
      color: "purple",
    },
    {
      label: "Warnings",
      value: warnings,
      icon: AlertTriangle,
      color: "orange",
    },
    {
      label: "Errors",
      value: errors,
      icon: ShieldAlert,
      color: "red",
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article className="summary-card" key={card.label}>
            <div className={`summary-icon ${card.color}`}>
              <Icon size={20} />
            </div>

            <p className="summary-label">{card.label}</p>
            <p className="summary-value">{card.value}</p>
          </article>
        );
      })}
    </div>
  );
}
