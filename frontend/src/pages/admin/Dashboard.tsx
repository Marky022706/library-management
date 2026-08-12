import { useMemo, type ReactNode } from 'react';
import { BookOpen, Users, BookMarked, AlertTriangle, ClipboardList, QrCode } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';

function isToday(value: string): boolean {
  const date = new Date(value);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function last7Days(): { key: string; label: string }[] {
  const days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({ key: date.toDateString(), label: date.toLocaleDateString('en-US', { weekday: 'short' }) });
  }
  return days;
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  accent: string;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <Card className="flex items-center gap-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent}`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const lib = useLibrary();

  const totalBooks = useMemo(() => lib.books.filter((b) => b.status === 'active').length, [lib.books]);
  const totalMembers = useMemo(() => lib.users.filter((u) => u.role === 'member').length, [lib.users]);
  const borrowedBooks = useMemo(() => lib.borrowings.filter((b) => b.status === 'active').length, [lib.borrowings]);
  const overdueBooks = useMemo(() => lib.borrowings.filter((b) => b.status === 'overdue').length, [lib.borrowings]);
  const pendingRequests = useMemo(() => lib.requests.filter((r) => r.status === 'pending').length, [lib.requests]);
  const todaysAttendance = useMemo(() => lib.attendance.filter((a) => isToday(a.date)).length, [lib.attendance]);

  const borrowingTrend = useMemo(() => {
    const days = last7Days();
    return days.map((day) => ({
      ...day,
      count: lib.borrowings.filter((b) => new Date(b.requestedDate).toDateString() === day.key).length,
    }));
  }, [lib.borrowings]);
  const borrowingMax = Math.max(1, ...borrowingTrend.map((d) => d.count));

  const attendanceTrend = useMemo(() => {
    const days = last7Days();
    return days.map((day) => ({
      ...day,
      count: lib.attendance.filter((a) => new Date(a.date).toDateString() === day.key).length,
    }));
  }, [lib.attendance]);
  const attendanceMax = Math.max(1, ...attendanceTrend.map((d) => d.count));

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    lib.books
      .filter((b) => b.status === 'active')
      .forEach((b) => counts.set(b.category, (counts.get(b.category) ?? 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [lib.books]);
  const categoryMax = Math.max(1, ...categoryCounts.map(([, count]) => count));

  const inventoryTotals = useMemo(() => {
    const activeBooks = lib.books.filter((b) => b.status === 'active');
    const totalQuantity = activeBooks.reduce((sum, b) => sum + b.quantity, 0);
    const totalAvailable = activeBooks.reduce((sum, b) => sum + b.available, 0);
    return { totalQuantity, totalAvailable, totalBorrowed: totalQuantity - totalAvailable };
  }, [lib.books]);
  const availablePct = inventoryTotals.totalQuantity
    ? Math.round((inventoryTotals.totalAvailable / inventoryTotals.totalQuantity) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Library-wide statistics and trends.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={<BookOpen className="h-5 w-5 text-primary-700" />} label="Total Books" value={totalBooks} accent="bg-primary-50" />
        <StatCard icon={<Users className="h-5 w-5 text-blue-700" />} label="Total Members" value={totalMembers} accent="bg-blue-50" />
        <StatCard icon={<BookMarked className="h-5 w-5 text-indigo-700" />} label="Borrowed Books" value={borrowedBooks} accent="bg-indigo-50" />
        <StatCard icon={<AlertTriangle className="h-5 w-5 text-red-700" />} label="Overdue Books" value={overdueBooks} accent="bg-red-50" />
        <StatCard icon={<ClipboardList className="h-5 w-5 text-amber-700" />} label="Pending Requests" value={pendingRequests} accent="bg-amber-50" />
        <StatCard icon={<QrCode className="h-5 w-5 text-emerald-700" />} label="Today's Attendance" value={todaysAttendance} accent="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Borrowing Trends</CardTitle>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </CardHeader>
          <div className="flex h-40 items-end gap-2">
            {borrowingTrend.map((day) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-semibold text-gray-700">{day.count}</span>
                <div className="flex h-28 w-full items-end justify-center">
                  <div
                    className="w-full max-w-8 rounded-t-md bg-primary-500 transition-all"
                    style={{ height: `${Math.max((day.count / borrowingMax) * 100, day.count > 0 ? 8 : 2)}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-500">{day.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </CardHeader>
          <div className="flex h-40 items-end gap-2">
            {attendanceTrend.map((day) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-semibold text-gray-700">{day.count}</span>
                <div className="flex h-28 w-full items-end justify-center">
                  <div
                    className="w-full max-w-8 rounded-t-md bg-blue-500 transition-all"
                    style={{ height: `${Math.max((day.count / attendanceMax) * 100, day.count > 0 ? 8 : 2)}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-500">{day.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Inventory</CardTitle>
          <span className="text-xs text-gray-400">Top categories &amp; availability</span>
        </CardHeader>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Top Categories</p>
            {categoryCounts.map(([category, count]) => (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                  <span>{category}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-primary-500" style={{ width: `${(count / categoryMax) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Available vs. Borrowed</p>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-primary-500" style={{ width: `${availablePct}%` }} />
              <div className="h-full bg-amber-400" style={{ width: `${100 - availablePct}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-600">
              <span>
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary-500" />
                Available ({inventoryTotals.totalAvailable})
              </span>
              <span>
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-400" />
                Borrowed ({inventoryTotals.totalBorrowed})
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              {inventoryTotals.totalQuantity} total copies across {totalBooks} active titles.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
