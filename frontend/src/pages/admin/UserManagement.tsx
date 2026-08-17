import { useEffect, useMemo, useState } from 'react';
import { Search, User as UserIcon, Shield, Calendar, Download, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { UserTable } from '../../components/users/UserTable';
import { UserDetailsModal } from '../../components/users/UserDetailsModal';
import { LibraryCardModal } from '../../components/users/LibraryCardModal';
import { AddUserModal } from '../../components/users/AddUserModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import type { User } from '../../types';

export function UserManagement() {
  const { users, setUserStatus, refreshUsers } = useLibraryData();
  const { showToast } = useToast();

  useEffect(() => {
    refreshUsers();
  }, []);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [cardUser, setCardUser] = useState<User | null>(null);
  const [pendingSuspend, setPendingSuspend] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.studentId && user.studentId.toLowerCase().includes(query));
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Paginated Users
  const totalRows = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = (all: boolean) => {
    setSelectedIds(all ? paginatedUsers.map((u) => u.id) : []);
  };

  const handleApprove = (user: User) => {
    setUserStatus(user.id, 'active');
    showToast(`${user.name} approved! Membership active & Digital Library Card issued.`, 'success');
  };

  const confirmToggleSuspend = () => {
    if (!pendingSuspend) return;
    const nextStatus = pendingSuspend.status === 'active' ? 'suspended' : 'active';
    setUserStatus(pendingSuspend.id, nextStatus);
    showToast(
      nextStatus === 'suspended'
        ? `${pendingSuspend.name} has been suspended.`
        : `${pendingSuspend.name} has been reactivated.`,
    );
    setPendingSuspend(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const rows = filteredUsers.map((u) => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Status: u.status,
      StudentID: u.studentId || '',
      Course: u.course || '',
      Phone: u.contactNumber || u.phone || '',
      Joined: u.registeredAt || '',
    }));

    if (rows.length === 0) {
      showToast('No user data to export.', 'info');
      return;
    }

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows.map((r) => Object.values(r).map(v => `"${v}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `balingasag_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported users to CSV successfully.', 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all users in one place. Control access, assign roles, and monitor activity across your platform.
        </p>
      </div>

      {/* 2. Controls & Filter Bar (Matching Mockup Design) */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search pill + Dropdown pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Pill Input */}
          <div className="relative min-w-50 sm:min-w-64">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="w-full rounded-full border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-xs transition-colors focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Role Filter Pill */}
          <div className="relative">
            <div className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50">
              <UserIcon className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="cursor-pointer bg-transparent pr-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">Role: All</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Status Filter Pill */}
          <div className="relative">
            <div className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50">
              <Shield className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="cursor-pointer bg-transparent pr-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Date Filter Pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-700">All Time</span>
          </div>
        </div>

        {/* Right: Export & + Add User Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      {/* 3. Modern User Table */}
      <UserTable
        users={paginatedUsers}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onView={setViewingUser}
        onApprove={handleApprove}
        onToggleSuspend={setPendingSuspend}
        onViewCard={setCardUser}
      />

      {/* 4. Footer Pagination Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 text-xs text-slate-600 font-medium">
        {/* Left: Rows per page */}
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs focus:border-emerald-600 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-500">of {totalRows} rows</span>
        </div>

        {/* Right: Page navigation pills */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            title="First Page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            title="Previous Page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setCurrentPage(p)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                currentPage === p
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            title="Next Page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            title="Last Page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 5. Modals */}
      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={refreshUsers}
      />

      <UserDetailsModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onApprove={handleApprove}
        onOpenCard={setCardUser}
      />

      <LibraryCardModal user={cardUser} onClose={() => setCardUser(null)} />

      <ConfirmDialog
        open={Boolean(pendingSuspend)}
        title={pendingSuspend?.status === 'active' ? 'Suspend user account?' : 'Reactivate user account?'}
        message={
          pendingSuspend?.status === 'active'
            ? `${pendingSuspend?.name} will lose access to library loans and portal features.`
            : `${pendingSuspend?.name} will regain full active library privileges.`
        }
        confirmLabel={pendingSuspend?.status === 'active' ? 'Suspend' : 'Reactivate'}
        danger={pendingSuspend?.status === 'active'}
        onConfirm={confirmToggleSuspend}
        onCancel={() => setPendingSuspend(null)}
      />
    </div>
  );
}
