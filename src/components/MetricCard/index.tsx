import { type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}

export function MetricCard({ icon: Icon, label, value, description }: MetricCardProps) {
  return (
    <div className="border-border bg-card rounded-lg border p-5 shadow-md dark:shadow-black/30">
      <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
        <Icon className="text-primary size-4" />
        {label}
      </div>
      <p className="text-card-foreground mt-2 text-2xl font-bold">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{description}</p>
    </div>
  );
}
