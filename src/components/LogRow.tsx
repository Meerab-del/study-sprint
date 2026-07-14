import { LogEntry } from "../types";

interface LogRowProps {
  entry: LogEntry;
}

export default function LogRow({ entry }: LogRowProps) {
  // pick label + colors based on whether the sprint was done or skipped
  const isDone = entry.status === "done";
  const statusLabel = isDone ? "Completed" : "Skipped";
  const statusBg = isDone ? "bg-[var(--teal-soft)]" : "bg-[var(--danger-soft)]";
  const statusText = isDone ? "text-[var(--teal-text)]" : "text-[var(--danger-text)]";

  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-[var(--line)] last:border-b-0">
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-[var(--ink)] truncate">
          {entry.label}
        </span>
        <span className="text-xs text-[var(--ink-soft)]">
          {entry.time} · {entry.minutes} min
        </span>
      </div>
      <span className={`text-xs font-medium rounded-full px-2.5 py-1 shrink-0 ${statusBg} ${statusText}`}>
        {statusLabel}
      </span>
    </li>
  );
}
