import { Library } from 'lucide-react';
import type { User, UserStatus } from '@/types';
import { Badge } from '@/components/ui';
import { QrPlaceholder } from '@/components/ui';
import { formatDate } from '@/utils/date';

export interface LibraryCardProps {
  user: User;
}

const STATUS_VARIANT: Record<UserStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'danger',
  inactive: 'neutral',
};

export function LibraryCard({ user }: LibraryCardProps) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 p-5 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Library className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">Balingasag</p>
            <p className="text-sm font-bold uppercase tracking-wide">Public Library</p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">
          {user.status}
        </Badge>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-primary-200">Member Name</p>
          <p className="truncate text-lg font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="mt-3 text-xs uppercase tracking-wide text-primary-200">Member ID</p>
          <p className="font-mono text-sm tracking-wider">{user.libraryCardId}</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-primary-200">Member Since</p>
          <p className="text-sm">{formatDate(user.registeredAt)}</p>
        </div>
        <div className="shrink-0 rounded-lg bg-white p-1.5">
          <QrPlaceholder value={user.libraryCardId} size={88} />
        </div>
      </div>
    </div>
  );
}
