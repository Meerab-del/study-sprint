import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import TimerBoard from "./components/TimerBoard";
import StatBadge from "./components/StatBadge";
import LogRow from "./components/LogRow";
import ThemeToggle from "./components/ThemeToggle";
import { Duration, LogEntry } from "./types";

const DURATIONS: Duration[] = [
  { label: "Sprint", minutes: 25 },
  { label: "Deep", minutes: 50 },
  { label: "Short break", minutes: 5 },
];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [durationIdx, setDurationIdx] = useState(0); // which DURATIONS option is picked
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [syncing, setSyncing] = useState(false); // true while "saving" the sprint
  const [syncError, setSyncError] = useState(false); // true if the fake save failed
  const [log, setLog] = useState<LogEntry[]>([
    { label: "Deep work — Bison grammar", time: "9:10 AM", minutes: 50, status: "done" },
    { label: "Sprint — SHAP write-up", time: "8:20 AM", minutes: 25, status: "skipped" },
  ]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ticks the timer down every second while running
  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const total = DURATIONS[durationIdx].minutes * 60;
  const pct = Math.round(((total - secondsLeft) / total) * 100); // % done, for the progress bar
  const complete = secondsLeft === 0;

  const handleDurationChange = useCallback(
    (idx: number) => {
      if (running) return;
      setDurationIdx(idx);
      setSecondsLeft(DURATIONS[idx].minutes * 60);
    },
    [running]
  );

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(DURATIONS[durationIdx].minutes * 60);
  };

  // fakes a network save — 30% chance it "fails" so the error state can be seen
  const handleFinishSync = () => {
    setSyncing(true);
    setSyncError(false);
    setTimeout(() => {
      setSyncing(false);
      const failed = Math.random() < 0.3;
      if (failed) {
        setSyncError(true);
        return;
      }
      setLog((l) => [
        {
          label: `${DURATIONS[durationIdx].label} — untitled task`,
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          minutes: DURATIONS[durationIdx].minutes,
          status: "done",
        },
        ...l,
      ]);
      handleReset();
    }, 1100);
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 sm:py-12">
        <header className="flex items-center justify-between mb-10 sm:mb-14">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--amber)]" />
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
              Study Sprint
            </span>
          </div>
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
        </header>

        <main>

        <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 sm:gap-8 mb-10">
          <div className="rounded-2xl p-6 sm:p-9 bg-[var(--surface)]" style={{ boxShadow: "var(--shadow)" }}>
            <h1
              className="mb-1 text-[var(--ink)]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {complete ? "Sprint complete" : running ? "In progress" : "Ready when you are"}
            </h1>
            <p className="text-sm mb-6 sm:mb-8 text-[var(--ink-soft)]">
              {DURATIONS[durationIdx].label} · {DURATIONS[durationIdx].minutes} minutes, heads down.
            </p>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <TimerBoard seconds={secondsLeft} />
              <div className="hidden sm:flex flex-col items-end gap-1 min-w-[6rem]" aria-hidden="true">
                <div className="w-28 h-1.5 rounded-full overflow-hidden bg-[var(--surface-2)]">
                  <div
                    className="h-full rounded-full transition-[width] duration-[900ms] ease-linear"
                    style={{ width: `${pct}%`, background: complete ? "var(--teal)" : "var(--amber)" }}
                  />
                </div>
                <span className="text-xs text-[var(--ink-soft)]">{pct}% through</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-7 sm:mt-8 mb-6" role="group" aria-label="Choose sprint duration">
              {DURATIONS.map((d, idx) => {
                const active = idx === durationIdx;
                return (
                  <button
                    key={d.label}
                    type="button"
                    disabled={running}
                    onClick={() => handleDurationChange(idx)}
                    aria-pressed={active}
                    className="text-xs font-medium rounded-full px-3.5 py-1.5 transition-colors duration-150 disabled:cursor-not-allowed"
                    style={{
                      background: running ? "var(--surface-2)" : active ? "var(--amber-soft)" : "transparent",
                      color: running ? "var(--ink-soft)" : active ? "var(--amber-text)" : "var(--ink-soft)",
                      border: `1px solid ${running ? "var(--line)" : active ? "var(--amber)" : "var(--line)"}`,
                    }}
                  >
                    {d.label} · {d.minutes}m
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!complete ? (
                <>
                  <Button variant="primary" size="lg" onClick={() => setRunning((r) => !r)}>
                    {running ? "Pause" : secondsLeft === total ? "Start sprint" : "Resume"}
                  </Button>
                  <Button variant="ghost" onClick={handleReset} disabled={secondsLeft === total && !running}>
                    Reset
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" size="lg" loading={syncing} onClick={handleFinishSync}>
                    {syncing ? "Saving to log…" : "Save to log"}
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    Discard
                  </Button>
                </>
              )}
            </div>

            {syncError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm bg-[var(--danger-soft)] text-[var(--danger)]"
              >
                <span aria-hidden="true" className="mt-0.5">⚠</span>
                <span>Couldn't save your sprint — the connection dropped. Your time isn't lost; try saving again.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-5 sm:p-6 flex flex-wrap gap-3 bg-[var(--surface)]" style={{ boxShadow: "var(--shadow)" }}>
              <StatBadge label="Today" value="2h 15m" tone="amber" />
              <StatBadge label="Streak" value="6 days" tone="teal" />
              <StatBadge label="Sprints" value="3" tone="ink" />
            </div>
            <div
              className="rounded-2xl p-5 sm:p-6 text-sm leading-relaxed text-[var(--ink-soft)] bg-[var(--surface)]"
              style={{ boxShadow: "var(--shadow)" }}
            >
              <p className="text-[var(--ink)] font-medium mb-1.5">Board tip</p>
              Sprints under 30 minutes save automatically to today's log — no need to name them until you review.
            </div>
          </div>
        </section>

        <section className="rounded-2xl p-6 sm:p-8 bg-[var(--surface)]" style={{ boxShadow: "var(--shadow)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2
              className="text-[var(--ink)]"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 600 }}
            >
              Today's log
            </h2>
            <span className="text-xs text-[var(--ink-soft)]">{log.length} entries</span>
          </div>
          <ul>
            {log.map((entry, i) => (
              <LogRow key={i} entry={entry} />
            ))}
          </ul>
        </section>
        </main>
      </div>
    </div>
  );
}
