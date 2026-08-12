import { useMemo, useState } from 'react';
import { Search, Eye, ShieldCheck } from 'lucide-react';
import type { User, UserRole, UserStatus } from '@/types';
import { fullName } from '@/types';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  Modal,
  ConfirmDialog,
  DataTable,
  Pagination,
  type DataTableColumn,
  type ButtonVariant,
} from '@/components/ui';
import { UserDetailsModal } from '@/components/users/UserDetailsModal';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/date';

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

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Member', value: 'member' },
  { label: 'Admin', value: 'admin' },
  { label: 'Superadmin', value: 'superadmin' },
];

const STATUS_TOAST: Record<string, string> = {
  Approve: 'Member approved successfully.',
  Activate: 'Account activated successfully.',
  Deactivate: 'Account deactivated successfully.',
  Suspend: 'Account suspended successfully.',
};

interface StatusAction {
  label: string;
  nextStatus: UserStatus;
  variant: ButtonVariant;
}

function actionsFor(user: User): StatusAction[] {
  const actions: StatusAction[] = [];
  if (user.status === 'pending') actions.push({ label: 'Approve', nextStatus: 'active', variant: 'success' });
  if (user.status === 'inactive' || user.status === 'suspended') {
    actions.push({ label: 'Activate', nextStatus: 'active', variant: 'success' });
  }
  if (user.status === 'active') actions.push({ label: 'Deactivate', nextStatus: 'inactive', variant: 'outline' });
  if (user.status !== 'suspended') actions.push({ label: 'Suspend', nextStatus: 'suspended', variant: 'danger' });
  return actions;
}

interface StatusTarget {
  user: User;
  action: StatusAction;
}

export function Users() {
  const lib = useLibrary();
  const { currentUser } = useAuth();
  const toast = useToast();
  const isSuperadmin = currentUser?.role === 'superadmin';

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const detailsModal = useDisclosure();
  const [viewedUser, setViewedUser] = useState<User | null>(null);

  const roleModal = useDisclosure();
  const [roleTargetUser, setRoleTargetUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [isAssigningRole, setIsAssigningRole] = useState(false);

  const [statusTarget, setStatusTarget] = useState<StatusTarget | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return lib.users.filter((user) => {
      if (roleFilter && user.role !== roleFilter) return false;
      if (statusFilter && user.status !== statusFilter) return false;
      if (query) {
        const haystack = `${fullName(user)} ${user.email}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [lib.users, search, roleFilter, statusFilter]);

  const { page, totalPages, pageItems, setPage } = usePagination(filteredUsers, 8);

  if (!currentUser) return null;

  function openRoleModal(user: User) {
    setRoleTargetUser(user);
    setSelectedRole(user.role);
    roleModal.open();
  }

  async function handleAssignRole() {
    if (!roleTargetUser) return;
    setIsAssigningRole(true);
    try {
      await lib.assignUserRole(roleTargetUser.id, selectedRole, currentUser!.id);
      toast.success('Role updated successfully.');
      roleModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsAssigningRole(false);
    }
  }

  async function handleConfirmStatusChange() {
    if (!statusTarget) return;
    setIsUpdatingStatus(true);
    try {
      await lib.updateUserStatus(statusTarget.user.id, statusTarget.action.nextStatus, currentUser!.id);
      toast.success(STATUS_TOAST[statusTarget.action.label] ?? 'Account updated successfully.');
      setStatusTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (user) => <span className="font-medium text-gray-900">{fullName(user)}</span>,
    },
    { key: 'email', header: 'Email', render: (user) => user.email },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <Badge variant={ROLE_VARIANT[user.role]} className="capitalize">
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">
          {user.status}
        </Badge>
      ),
    },
    { key: 'registered', header: 'Registered', render: (user) => formatDate(user.registeredAt) },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (user) => (
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="!px-2"
            aria-label={`View ${fullName(user)}`}
            title="View profile"
            onClick={() => {
              setViewedUser(user);
              detailsModal.open();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isSuperadmin && (
            <Button
              variant="ghost"
              size="sm"
              className="!px-2"
              aria-label={`Assign role to ${fullName(user)}`}
              title="Assign role"
              onClick={() => openRoleModal(user)}
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>
          )}
          {actionsFor(user).map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="sm"
              onClick={() => setStatusTarget({ user, action })}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage member and staff accounts.</p>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            containerClassName="sm:w-64"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              options={[
                { label: 'Member', value: 'member' },
                { label: 'Admin', value: 'admin' },
                { label: 'Superadmin', value: 'superadmin' },
              ]}
              placeholder="All roles"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              containerClassName="sm:w-40"
            />
            <Select
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Suspended', value: 'suspended' },
              ]}
              placeholder="All statuses"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              containerClassName="sm:w-40"
            />
          </div>
        </div>

        <div className="pt-4">
          <DataTable
            columns={columns}
            data={pageItems}
            keyField={(user) => user.id}
            emptyTitle="No members found"
            emptyDescription="Try adjusting your search or filters."
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
        </div>
      </Card>

      <UserDetailsModal isOpen={detailsModal.isOpen} onClose={detailsModal.close} user={viewedUser} />

      <Modal
        isOpen={roleModal.isOpen}
        onClose={roleModal.close}
        title="Assign Role"
        description={roleTargetUser ? `Change the role for ${fullName(roleTargetUser)}.` : undefined}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={roleModal.close} disabled={isAssigningRole}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} isLoading={isAssigningRole}>
              Save Role
            </Button>
          </>
        }
      >
        <Select
          label="Role"
          options={ROLE_OPTIONS}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={statusTarget !== null}
        title={statusTarget ? `${statusTarget.action.label} this account?` : ''}
        message={
          statusTarget
            ? `${fullName(statusTarget.user)}'s account status will be set to "${statusTarget.action.nextStatus}".`
            : ''
        }
        confirmLabel={statusTarget?.action.label ?? 'Confirm'}
        variant={statusTarget?.action.nextStatus === 'suspended' ? 'danger' : 'default'}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  );
}
