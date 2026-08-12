import { useMemo } from 'react';
import type { User, UserRole, UserStatus } from '@/types';
import { fullName } from '@/types';
import { Modal, Badge } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { formatDate, formatDateTime } from '@/utils/date';

export interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ROLE_VARIANT: Record<UserRole, 'neutral' | 'primary' | 'info'> = {
  member: 'neutral',
  admin: 'primary',
  superadmin: 'info',
};

const STATUS_VARIANT: Record<UserStatus, 'warning' | 'success' | 'neutral' | 'danger'> = {
  pending: 'warning',
  active: 'success',
  inactive: 'neutral',
  suspended: 'danger',
};

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const { borrowingsByUser } = useLibrary();

  const stats = useMemo(() => {
    if (!user) return { active: 0, total: 0 };
    const borrowings = borrowingsByUser(user.id);
    return {
      active: borrowings.filter((b) => b.status === 'active' || b.status === 'overdue').length,
      total: borrowings.length,
    };
  }, [borrowingsByUser, user]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Profile" size="md">
      {user && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{fullName(user)}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={ROLE_VARIANT[user.role]} className="capitalize">
                  {user.role}
                </Badge>
                <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Phone</p>
              <p className="text-sm text-gray-900">{user.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Library Card ID</p>
              <p className="text-sm text-gray-900">{user.libraryCardId}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Address</p>
              <p className="text-sm text-gray-900">{user.address}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Registered</p>
              <p className="text-sm text-gray-900">{formatDate(user.registeredAt)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Last Login</p>
              <p className="text-sm text-gray-900">{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Active Borrowings</p>
              <p className="text-xl font-semibold text-gray-900">{stats.active}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Borrowings</p>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
