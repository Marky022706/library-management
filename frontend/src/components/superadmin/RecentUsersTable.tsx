import { useState, useMemo } from 'react';
import { Search, Eye, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { User } from '../../types';

interface RecentUsersTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onViewAllUsers?: () => void;
}

export function RecentUsersTable({ users, onViewUser, onViewAllUsers }: RecentUsersTableProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.studentId && u.studentId.toLowerCase().includes(search.toLowerCase()));
      const userRoleNormalized = (u.role as string).replace('_', '');
      const matchRole = roleFilter === 'all' || userRoleNormalized === roleFilter.replace('_', '');
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const displayedUsers = filtered.slice((page - 1) * pageSize, page * pageSize);

  const STATUS_TONE = {
    active: 'green' as const,
    pending: 'amber' as const,
    suspended: 'red' as const,
  };

  const ROLE_TONE = {
    superadmin: 'purple' as const,
    super_admin: 'purple' as const,
    admin: 'blue' as const,
    member: 'neutral' as const,
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Filter users by name, email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="member">Members</option>
            <option value="admin">Admins</option>
            <option value="superadmin">Super Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2.5 pr-4">User Name & Email</th>
              <th className="py-2.5 pr-4">System Role</th>
              <th className="py-2.5 pr-4">Account Status</th>
              <th className="py-2.5 pr-4">Registered Date</th>
              <th className="py-2.5 pr-0 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedUsers.map((u) => (
              <tr key={u.id || u.email} className="transition-colors hover:bg-slate-50/80">
                <td className="py-3 pr-4">
                  <p className="font-semibold text-slate-800">{u.name}</p>
                  <p className="text-[11px] text-slate-400">{u.email}</p>
                </td>
                <td className="py-3 pr-4">
                  <Badge tone={ROLE_TONE[u.role as keyof typeof ROLE_TONE] || 'neutral'}>
                    {u.role === 'superadmin' || (u.role as string) === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Member'}
                  </Badge>
                </td>
                <td className="py-3 pr-4">
                  <Badge tone={STATUS_TONE[u.status as keyof typeof STATUS_TONE] || 'neutral'} dot>
                    {u.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-slate-500">{u.registeredAt || 'Aug 16, 2026'}</td>
                <td className="py-3 pr-0 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewUser(u)}
                    className="h-7 px-2.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {u.status === 'pending' ? 'Review' : 'View'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Full View Link */}
      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
        <span>Showing {displayedUsers.length} of {filtered.length} users</span>
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-1 text-[11px] font-medium">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
          {onViewAllUsers && (
            <Button
              size="sm"
              variant="outline"
              onClick={onViewAllUsers}
              className="h-7 px-2.5 text-xs text-emerald-800 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100"
            >
              Full Directory
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
