import { useState } from 'react';
import { Edit, Trash2, ArrowUpDown, QrCode } from 'lucide-react';
import type { User } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { Users as UsersIcon } from 'lucide-react';
import { formatDate } from '../../utils/date';

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onApprove: (user: User) => void;
  onToggleSuspend: (user: User) => void;
  onViewCard?: (user: User) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (all: boolean) => void;
}

export function UserTable({
  users,
  onView,
  onToggleSuspend,
  onViewCard,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: UserTableProps) {
  const [sortField, setSortField] = useState<string>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  if (users.length === 0) {
    return <EmptyState icon={UsersIcon} title="No users found" description="Try adjusting your search or filters." />;
  }

  // Render Status Badge matching exact screenshot design
  const renderStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <span className="inline-block rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-white">Active</span>;
      case 'pending':
        return <span className="inline-block rounded-full bg-slate-900 px-3 py-0.5 text-xs font-semibold text-white">Pending</span>;
      case 'suspended':
        return <span className="inline-block rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-white">Suspended</span>;
      default:
        return <span className="inline-block rounded-full bg-slate-500 px-3 py-0.5 text-xs font-semibold text-white">Inactive</span>;
    }
  };

  const renderRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'Member';
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-xs">
      <table className="w-full min-w-245 table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="w-12 py-3 pl-4 pr-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 rounded-sm border-slate-400 bg-white/20 text-emerald-600 focus:ring-emerald-500"
                aria-label="Select all users"
              />
            </th>

            <th
              className="w-[17%] cursor-pointer py-3 pr-4 transition-colors hover:text-primary-700"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1.5">
                <span>Full Name</span>
                <ArrowUpDown className="h-3 w-3 opacity-70" />
              </div>
            </th>

            <th
              className="w-[18%] cursor-pointer py-3 pr-4 transition-colors hover:text-primary-700"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center gap-1.5">
                <span>Email</span>
                <ArrowUpDown className="h-3 w-3 opacity-70" />
              </div>
            </th>

            <th
              className="w-[17%] cursor-pointer py-3 pr-4 transition-colors hover:text-primary-700"
              onClick={() => handleSort('username')}
            >
              <div className="flex items-center gap-1.5">
                <span>Username / ID</span>
                <ArrowUpDown className="h-3 w-3 opacity-70" />
              </div>
            </th>

            <th
              className="w-[10%] cursor-pointer py-3 pr-4 transition-colors hover:text-primary-700"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1.5">
                <span>Status</span>
                <ArrowUpDown className="h-3 w-3 opacity-70" />
              </div>
            </th>

            <th
              className="w-[10%] cursor-pointer py-3 pr-4 transition-colors hover:text-primary-700"
              onClick={() => handleSort('role')}
            >
              <div className="flex items-center gap-1.5">
                <span>Role</span>
                <ArrowUpDown className="h-3 w-3 opacity-70" />
              </div>
            </th>

            <th
              className="w-[12%] cursor-pointer py-3 pr-4 transition-colors hover:text-primary-700"
              onClick={() => handleSort('registeredAt')}
            >
              <div className="flex items-center gap-1.5">
                <span>Joined Date</span>
                <ArrowUpDown className="h-3 w-3 opacity-70" />
              </div>
            </th>

            <th className="w-[13%] py-3 pr-4">
              <div className="flex items-center gap-1.5">
                <span>Contact / Info</span>
                <ArrowUpDown className="h-3 w-3 opacity-70" />
              </div>
            </th>

            <th className="w-20 py-3 pr-4 text-right">
              <span>Actions</span>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-slate-700">
          {users.map((user) => {
            const isSelected = selectedIds.includes(user.id);
            const username = user.email.split('@')[0];

            return (
              <tr
                key={user.id}
                className={`border-b border-line last:border-0 transition-colors hover:bg-gray-50/60 ${isSelected ? 'bg-primary-50' : ''}`}
              >
                {/* Checkbox */}
                <td className="py-3 pl-4 pr-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(user.id)}
                    className="h-4 w-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    aria-label={`Select ${user.name}`}
                  />
                </td>

                {/* Avatar + Full Name */}
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-semibold text-slate-900 truncate max-w-45">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="max-w-0 truncate py-3 pr-4 text-slate-600">
                  {user.email}
                </td>

                {/* Username / Student ID */}
                <td className="max-w-0 truncate py-3 pr-4 font-medium text-slate-600">
                  {user.studentId || username}
                </td>

                {/* Status Pill */}
                <td className="py-3 pr-4">
                  {renderStatusBadge(user.status)}
                </td>

                {/* Role */}
                <td className="py-3 pr-4 font-medium text-slate-700">
                  {renderRoleLabel(user.role)}
                </td>

                {/* Joined Date */}
                <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                  {formatDate(user.registeredAt || user.created_at || '2024-01-15')}
                </td>

                {/* Contact / Course */}
                <td className="max-w-0 py-3 pr-4 text-xs text-slate-500">
                  {user.course ? (
                    <span className="truncate max-w-35 block" title={user.course}>
                      {user.course}
                    </span>
                  ) : user.contactNumber || user.phone ? (
                    <span>{user.contactNumber || user.phone}</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                {/* Actions (Edit / View, QR, Delete/Suspend) */}
                <td className="py-3 pr-4 text-right">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* View / Edit User Details */}
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      title="View & Edit User"
                      aria-label={`Edit ${user.name}`}
                      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {/* QR Library Card (for Active Members) */}
                    {user.status === 'active' && onViewCard && (
                      <button
                        type="button"
                        onClick={() => onViewCard(user)}
                        title="Digital Library Card & QR"
                        aria-label={`Library card for ${user.name}`}
                        className="rounded-lg p-1.5 text-emerald-700 transition-colors hover:bg-emerald-50"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                    )}

                    {/* Suspend / Delete */}
                    <button
                      type="button"
                      onClick={() => onToggleSuspend(user)}
                      title={user.status === 'suspended' ? 'Reactivate User' : 'Suspend / Remove User'}
                      aria-label={`Suspend or remove ${user.name}`}
                      className="rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
