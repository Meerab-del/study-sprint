interface StatBadgeProps {
  label: string;
  value: string;
  tone?: "ink" | "teal" | "amber";
}

// each tone just needs a background + text color pair
// note: text uses the "-text" token (darker), not the base accent color —
// the base color doesn't have enough contrast for small text on its own soft background
const toneColors = {
  ink: { bg: "bg-[var(--surface-2)]", text: "text-[var(--ink)]" },
  teal: { bg: "bg-[var(--teal-soft)]", text: "text-[var(--teal-text)]" },
  amber: { bg: "bg-[var(--amber-soft)]", text: "text-[var(--amber-text)]" },
};

export default function StatBadge({ label, value, tone = "ink" }: StatBadgeProps) {
  const colors = toneColors[tone];

  return (
    <div className={`flex flex-col gap-0.5 rounded-xl px-4 py-3 min-w-[7.5rem] ${colors.bg}`}>
      <span className="text-[0.7rem] uppercase tracking-wider text-[var(--ink-soft)]">
        {label}
      </span>
      <span
        className={`text-xl font-semibold ${colors.text}`}
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {value}
      </span>
    </div>
  );
}
