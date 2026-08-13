import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type BadgeTone = 'neutral' | 'blue' | 'purple' | 'red' | 'amber' | 'green';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-primary-100 text-primary-800',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

/** Small rounded status pill. Status is always conveyed by its text label too, never color alone. */
export function Badge({ tone = 'neutral', children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASSES[tone])} aria-hidden="true" />}
      {children}
    </span>
  );
}

const DOT_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-gray-500',
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  red: 'bg-red-600',
  amber: 'bg-amber-500',
  green: 'bg-primary-600',
};
