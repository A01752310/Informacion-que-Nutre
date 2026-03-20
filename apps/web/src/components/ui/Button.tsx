import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  isLoading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg shadow-primary/10 hover:opacity-90 px-8 py-4",
  secondary:
    "bg-secondary text-on-secondary shadow-lg shadow-secondary/20 hover:opacity-90 px-8 py-4",
  outline:
    "border-2 border-primary text-primary hover:bg-surface-container-low px-8 py-4",
  ghost:
    "text-primary hover:bg-surface-container px-4 py-2",
};

export default function Button({
  variant = "primary",
  children,
  isLoading,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
