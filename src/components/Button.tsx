import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const sizeStyles = {
  sm: { fontSize: "0.875rem", padding: "0.5rem 1rem" },
  md: { fontSize: "0.875rem", padding: "0.625rem 1.25rem" },
  lg: { fontSize: "1rem", padding: "0.875rem 1.75rem" },
};

// normal (enabled) colors for each variant
const variantStyles = {
  primary: { background: "var(--amber)", color: "var(--board)", border: "none" },
  ghost: { background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" },
  danger: { background: "var(--danger-soft)", color: "var(--danger-text)", border: "none" },
};

// disabled uses solid muted colors instead of opacity, so text still has
// enough contrast to pass Lighthouse (opacity-based dimming failed this)
const disabledStyle = {
  background: "var(--surface-2)",
  color: "var(--ink-soft)",
  border: "1px solid var(--line)",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const colors = isDisabled ? disabledStyle : variantStyles[variant];

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 ease-out hover:brightness-110 hover:-translate-y-px active:scale-[0.97] disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:translate-y-0 ${className}`}
      style={{ ...sizeStyles[size], ...colors, ...style }}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {children}
    </button>
  );
}
