type BadgeVariant = "pending" | "approved" | "rejected" | "info" | "cost" | "time" | "difficulty";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  pending: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  approved: "bg-primary-fixed text-on-primary-fixed-variant",
  rejected: "bg-error-container text-on-error-container",
  info: "bg-surface-container-highest text-on-surface-variant",
  cost: "bg-primary-fixed text-on-primary-fixed-variant",
  time: "bg-secondary-fixed text-on-secondary-fixed-variant",
  difficulty: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

export default function Badge({
  variant = "info",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-tighter ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
