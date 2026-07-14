interface FlapDigitProps {
  char: string;
}

export default function FlapDigit({ char }: FlapDigitProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md sm:rounded-lg bg-[var(--board)] text-[var(--board-digit)] font-semibold transition-colors duration-200"
      style={{
        width: "clamp(2.1rem, 6vw, 3.6rem)",
        height: "clamp(2.8rem, 8vw, 4.6rem)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "clamp(1.5rem, 4.5vw, 2.6rem)",
        boxShadow:
          "inset 0 -2px 0 rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.05)",
      }}
    >
      {char}
    </span>
  );
}
