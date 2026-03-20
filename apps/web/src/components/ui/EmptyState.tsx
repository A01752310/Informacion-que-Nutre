import Icon from "./Icon";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = "search_off",
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/30 text-center">
      <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
        <Icon name={icon} className="text-4xl text-outline" />
      </div>
      <h4 className="font-headline text-xl font-bold mb-2">{title}</h4>
      <p className="text-on-surface-variant text-sm max-w-[240px]">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
