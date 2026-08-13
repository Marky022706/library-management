import { cn } from '../../utils/cn';

interface UserProfileProps {
  name: string;
  subtitle?: string;
  compact?: boolean;
  dark?: boolean;
}

function initialsOf(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

/** Avatar + name/role used in both the sidebar profile card and the top header. */
export function UserProfile({ name, subtitle, compact = false, dark = false }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full font-semibold',
          compact ? 'h-8 w-8 text-sm' : 'h-10 w-10 text-base',
          dark ? 'bg-white/15 text-white' : 'bg-primary-100 text-primary-800',
        )}
        aria-hidden="true"
      >
        {initialsOf(name)}
      </span>
      <span className="min-w-0">
        <span className={cn('block truncate text-sm font-semibold', dark ? 'text-white' : 'text-ink')}>{name}</span>
        {subtitle && (
          <span className={cn('block truncate text-xs', dark ? 'text-primary-100' : 'text-muted')}>{subtitle}</span>
        )}
      </span>
    </div>
  );
}
