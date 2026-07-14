import FlapDigit from "./FlapDigit";

interface TimerBoardProps {
  seconds: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function TimerBoard({ seconds }: TimerBoardProps) {
  const m = pad(Math.floor(seconds / 60));
  const s = pad(seconds % 60);
  const chars = [...m, ":", ...s];

  return (
    <div
      className="flex items-center gap-1 sm:gap-1.5"
      role="timer"
      aria-live="polite"
      aria-label={`${m} minutes ${s} seconds remaining`}
    >
      {chars.map((c, i) =>
        c === ":" ? (
          <span
            key={i}
            aria-hidden="true"
            className="text-[var(--ink-soft)] font-bold"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}
          >
            :
          </span>
        ) : (
          <FlapDigit key={i} char={c} />
        )
      )}
    </div>
  );
}
