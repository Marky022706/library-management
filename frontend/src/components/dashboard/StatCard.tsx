import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type StatTone = 'green' | 'blue' | 'purple' | 'red' | 'amber';

const TONE_CLASSES: Record<StatTone, string> = {
  green: 'bg-primary-100 text-primary-700',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone: StatTone;
}

export function StatCard({ icon: Icon, label, value, tone }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', TONE_CLASSES[tone])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight text-ink">{value}</p>
        <p className="truncate text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
