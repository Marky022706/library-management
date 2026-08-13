import { useMemo, useState } from 'react';
import { Card } from '../../components/common/Card';
import { SearchInput } from '../../components/common/SearchInput';
import { Dropdown } from '../../components/common/Dropdown';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { UserTable } from '../../components/users/UserTable';
import { UserDetailsModal } from '../../components/users/UserDetailsModal';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import type { User } from '../../types';

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
];

export function UserManagement() {
  const { users, setUserStatus } = useLibraryData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [pendingSuspend, setPendingSuspend] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesSearch = !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleApprove = (user: User) => {
    setUserStatus(user.id, 'active');
    showToast(`${user.name} approved successfully.`);
  };

  const confirmToggleSuspend = () => {
    if (!pendingSuspend) return;
    const nextStatus = pendingSuspend.status === 'active' ? 'suspended' : 'active';
    setUserStatus(pendingSuspend.id, nextStatus);
    showToast(nextStatus === 'suspended' ? `${pendingSuspend.name} has been suspended.` : `${pendingSuspend.name} has been reactivated.`);
    setPendingSuspend(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">User Management</h1>

      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search users..." label="Search users" />
          </div>
          <div className="flex gap-3">
            <Dropdown value={roleFilter} onChange={setRoleFilter} options={ROLE_OPTIONS} label="Filter by role" />
            <Dropdown value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} label="Filter by status" />
          </div>
        </div>

        <UserTable users={filteredUsers} onView={setViewingUser} onApprove={handleApprove} onToggleSuspend={setPendingSuspend} />
      </Card>

      <UserDetailsModal user={viewingUser} onClose={() => setViewingUser(null)} />

      <ConfirmDialog
        open={Boolean(pendingSuspend)}
        title={pendingSuspend?.status === 'active' ? 'Suspend user?' : 'Reactivate user?'}
        message={
          pendingSuspend?.status === 'active'
            ? `${pendingSuspend?.name} will lose access to borrowing and account features until reactivated.`
            : `${pendingSuspend?.name} will regain full access to their account.`
        }
        confirmLabel={pendingSuspend?.status === 'active' ? 'Suspend' : 'Reactivate'}
        danger={pendingSuspend?.status === 'active'}
        onConfirm={confirmToggleSuspend}
        onCancel={() => setPendingSuspend(null)}
      />
    </div>
  );
}
