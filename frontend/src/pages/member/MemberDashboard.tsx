import { AlertTriangle, BookOpen, ClipboardList, Library, Megaphone } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge, type BadgeTone } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuth } from '../../context/AuthContext';
import { useLibraryData } from '../../context/LibraryDataContext';
import { findBookById } from '../../data/books';
import { MOCK_TODAY, daysBetween, formatDate } from '../../utils/date';
import type { BorrowRequest, RequestType } from '../../types';

const TYPE_TONE: Record<RequestType, BadgeTone> = {
  borrowing: 'blue',
  acquisition: 'purple',
  archive: 'neutral',
};

const STATUS_TONE: Record<BorrowRequest['status'], BadgeTone> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
};

function loanStatus(dueDate: string): { label: string; tone: BadgeTone } {
  const remaining = daysBetween(MOCK_TODAY, dueDate);
  if (remaining < 0) return { label: `Overdue ${Math.abs(remaining)}d`, tone: 'red' };
  if (remaining === 0) return { label: 'Due today', tone: 'amber' };
  if (remaining <= 3) return { label: `Due in ${remaining}d`, tone: 'amber' };
  return { label: `Due in ${remaining}d`, tone: 'green' };
}

export function MemberDashboard() {
  const { currentUser } = useAuth();
  const { requests, announcements } = useLibraryData();

  const myRequests = currentUser ? requests.filter((r) => r.requesterId === currentUser.id) : [];
  const activeLoans = myRequests.filter((r) => r.type === 'borrowing' && r.status === 'approved' && !r.returnedAt);
  const overdueLoans = activeLoans.filter((r) => r.dueDate && r.dueDate < MOCK_TODAY);
  const pendingRequests = myRequests.filter((r) => r.status === 'pending');
  const totalBorrowed = myRequests.filter((r) => r.type === 'borrowing' && r.status === 'approved').length;

  const recentRequests = [...myRequests].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const latestAnnouncements = announcements.filter((a) => a.status === 'published').slice(0, 3);

  const firstName = currentUser?.name.split(' ')[0] ?? '';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Welcome back, {firstName}. Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={BookOpen} label="Books Borrowed" value={activeLoans.length} tone="green" />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdueLoans.length} tone="red" />
        <StatCard icon={ClipboardList} label="Pending Requests" value={pendingRequests.length} tone="amber" />
        <StatCard icon={Library} label="Total Borrowed" value={totalBorrowed} tone="blue" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Current Loans" subtitle="Books you currently have checked out.">
          {activeLoans.length === 0 ? (
            <EmptyState icon={BookOpen} title="No active loans" description="Books you borrow will show up here with their due dates." />
          ) : (
            <ul className="flex flex-col gap-3">
              {activeLoans.map((loan) => {
                const book = loan.bookId ? findBookById(loan.bookId) : undefined;
                const status = loan.dueDate ? loanStatus(loan.dueDate) : null;
                return (
                  <li key={loan.id} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{book?.title ?? loan.note}</p>
                      <p className="truncate text-xs text-muted">
                        {book?.author && `${book.author} · `}
                        Borrowed {formatDate(loan.resolvedDate ?? loan.date)}
                        {loan.dueDate && ` · Due ${formatDate(loan.dueDate)}`}
                      </p>
                    </div>
                    {status && (
                      <Badge tone={status.tone} className="shrink-0">
                        {status.label}
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Library Announcements" subtitle="Latest updates from the library.">
          {latestAnnouncements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements" description="Check back later for library updates." />
          ) : (
            <ul className="flex flex-col gap-4">
              {latestAnnouncements.map((a) => (
                <li key={a.id}>
                  <p className="text-sm font-semibold text-ink">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatDate(a.date)}</p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">{a.content}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Recent Requests" subtitle="Your latest borrowing, acquisition, and archive requests.">
        {recentRequests.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No requests yet" description="Requests you make will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Book / Note</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-0">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="py-3 pr-4">
                      <Badge tone={TYPE_TONE[r.type]}>{r.type}</Badge>
                    </td>
                    <td className="max-w-[320px] truncate py-3 pr-4 text-ink" title={r.note}>
                      {r.note}
                    </td>
                    <td className="py-3 pr-4 text-muted">{formatDate(r.date)}</td>
                    <td className="py-3 pr-0">
                      <Badge tone={STATUS_TONE[r.status]} dot>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
