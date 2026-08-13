import { AlertTriangle, BookOpen, CalendarCheck, ClipboardList, Library, Users } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { BorrowingChart } from '../../components/dashboard/BorrowingChart';
import { CategoryChart } from '../../components/dashboard/CategoryChart';
import { useAuth } from '../../context/AuthContext';
import { useLibraryData } from '../../context/LibraryDataContext';

export function AdminDashboard() {
  const { currentUser } = useAuth();
  const { stats } = useLibraryData();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const firstName = currentUser?.name.split(' ')[0] ?? '';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}</h1>
        <p className="mt-1 text-sm text-muted">Welcome back, {firstName}.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={BookOpen} label="Total Books" value={stats.totalBooks} tone="green" />
        <StatCard icon={Users} label="Members" value={stats.members} tone="blue" />
        <StatCard icon={Library} label="Borrowed" value={stats.borrowed} tone="purple" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} tone="red" />
        <StatCard icon={ClipboardList} label="Pending Requests" value={stats.pendingRequests} tone="amber" />
        <StatCard icon={CalendarCheck} label="Today's Visitors" value={stats.todaysVisitors} tone="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Monthly Borrowing Trends">
          <BorrowingChart />
        </Card>
        <Card title="Book Inventory by Category">
          <CategoryChart />
        </Card>
      </div>
    </div>
  );
}
