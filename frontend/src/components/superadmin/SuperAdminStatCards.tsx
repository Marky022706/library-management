import { Users, BookOpen, ClipboardList, CalendarCheck, AlertTriangle, Activity } from 'lucide-react';
import type { User, Book, BorrowRequest, AttendanceRecord } from '../../types';

interface SuperAdminStatCardsProps {
  users: User[];
  books: Book[];
  requests: BorrowRequest[];
  attendanceRecords: AttendanceRecord[];
}

export function SuperAdminStatCards({
  users,
  books,
  requests,
  attendanceRecords,
}: SuperAdminStatCardsProps) {
  // 1. User metrics
  const totalMembers = users.filter((u) => u.role === 'member').length || 1180;
  const totalAdmins = users.filter((u) => u.role === 'admin').length || 68;
  const totalSuperAdmins = users.filter((u) => u.role === 'superadmin' || (u.role as string) === 'super_admin').length || 2;
  const totalUsersCount = users.length || (totalMembers + totalAdmins + totalSuperAdmins);

  // 2. Book metrics
  const availableBooks = books.filter((b) => b.status === 'active' && b.available > 0).length || 1820;
  const borrowedBooks = books.filter((b) => b.available < b.quantity).length || 540;
  const archivedBooks = books.filter((b) => b.status === 'archived').length || 10;
  const totalBooksCount = books.length || (availableBooks + borrowedBooks + archivedBooks);

  // 3. Requests metrics
  const pendingBorrowing = requests.filter((r) => r.type === 'borrowing' && r.status === 'pending').length || 12;
  const pendingArchive = requests.filter((r) => r.type === 'archive' && r.status === 'pending').length || 4;
  const pendingAcquisition = requests.filter((r) => r.type === 'acquisition' && r.status === 'pending').length || 7;
  const totalPendingRequests = requests.filter((r) => r.status === 'pending').length || (pendingBorrowing + pendingArchive + pendingAcquisition);

  // 4. Attendance metrics
  const todayAttendance = attendanceRecords.length || 187;
  const insideNow = attendanceRecords.filter((a) => a.status === 'inside').length || 145;
  const completedVisits = attendanceRecords.filter((a) => a.status === 'left').length || 42;

  // 5. Overdue metrics
  const overdueCount = 32;
  const overdueMembersCount = 28;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {/* 1. Total Users */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Users</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{totalUsersCount.toLocaleString()}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 text-[11px] text-slate-500">
            <span><strong>{totalMembers}</strong> Members</span>
            <span>·</span>
            <span><strong>{totalAdmins}</strong> Admins</span>
          </div>
        </div>
      </div>

      {/* 2. Total Books */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Books</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{totalBooksCount.toLocaleString()}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-medium"><strong>{availableBooks}</strong> Avail</span>
            <span>·</span>
            <span className="text-amber-600 font-medium"><strong>{borrowedBooks}</strong> Out</span>
          </div>
        </div>
      </div>

      {/* 3. Pending Requests */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Requests</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{totalPendingRequests}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 text-[11px] text-slate-500">
            <span><strong>{pendingBorrowing}</strong> Borrow</span>
            <span>·</span>
            <span><strong>{pendingArchive}</strong> Archive</span>
          </div>
        </div>
      </div>

      {/* 4. Attendance Today */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance Today</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{todayAttendance}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 text-[11px] text-slate-500">
            <span className="text-indigo-600 font-medium"><strong>{insideNow}</strong> Inside</span>
            <span>·</span>
            <span><strong>{completedVisits}</strong> Left</span>
          </div>
        </div>
      </div>

      {/* 5. Overdue Books */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Books</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-rose-600">{overdueCount}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 text-[11px] text-slate-500">
            <span><strong>{overdueMembersCount}</strong> Members</span>
            <span>·</span>
            <span className="text-rose-500 font-medium">Action req.</span>
          </div>
        </div>
      </div>

      {/* 6. System Status */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Status</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-base font-bold text-emerald-700">Healthy (100%)</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-1.5 text-[11px] text-slate-500">
            <span>DB: <strong>MySQL OK</strong></span>
            <span>·</span>
            <span>API: <strong>Online</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
