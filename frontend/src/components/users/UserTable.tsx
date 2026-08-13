import { Eye, ShieldCheck, UserCheck, UserX, Users as UsersIcon } from 'lucide-react';
import type { User } from '../../types';
import { Badge, type BadgeTone } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { formatDate } from '../../utils/date';

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onApprove: (user: User) => void;
  onToggleSuspend: (user: User) => void;
}

const ROLE_TONE: Record<User['role'], BadgeTone> = {
  member: 'neutral',
  admin: 'blue',
  superadmin: 'purple',
};

const ROLE_LABEL: Record<User['role'], string> = {
  member: 'Member',
  admin: 'Admin',
  superadmin: 'Super Admin',
};

const STATUS_TONE: Record<User['status'], BadgeTone> = {
  active: 'green',
  pending: 'amber',
  suspended: 'red',
};

export function UserTable({ users, onView, onApprove, onToggleSuspend }: UserTableProps) {
  if (users.length === 0) {
    return <EmptyState icon={UsersIcon} title="No users found" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Email</th>
            <th className="py-3 pr-4">Role</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Registered</th>
            <th className="py-3 pr-0 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-800" aria-hidden="true">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium text-ink">{user.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-muted">{user.email}</td>
              <td className="py-3 pr-4">
                <Badge tone={ROLE_TONE[user.role]}>{ROLE_LABEL[user.role]}</Badge>
              </td>
              <td className="py-3 pr-4">
                <Badge tone={STATUS_TONE[user.status]} dot>
                  {user.status}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-muted">{formatDate(user.registeredAt)}</td>
              <td className="py-3 pr-0">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView(user)}
                    title="View user"
                    aria-label={`View ${user.name}`}
                    className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {user.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => onApprove(user)}
                      title="Approve user"
                      aria-label={`Approve ${user.name}`}
                      className="rounded-lg p-2 text-primary-700 hover:bg-primary-50"
                    >
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                  {user.status !== 'pending' && (
                    <button
                      type="button"
                      onClick={() => onToggleSuspend(user)}
                      title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                      aria-label={`${user.status === 'active' ? 'Suspend' : 'Activate'} ${user.name}`}
                      className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink"
                    >
                      {user.status === 'active' ? (
                        <UserX className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <UserCheck className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
