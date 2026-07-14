interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      className="flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)] transition-transform duration-200 active:scale-95"
    >
      {/* small dot changes color based on theme */}
      <span
        aria-hidden="true"
        className={`h-3.5 w-3.5 rounded-full ${isDark ? "bg-[var(--teal)]" : "bg-[var(--amber)]"}`}
      />
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
