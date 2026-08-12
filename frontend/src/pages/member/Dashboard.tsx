import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Clock, CalendarClock, Bell, Megaphone, ArrowRight, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { Card, CardHeader, CardTitle, Badge, Button, EmptyState } from '@/components/ui';
import { BookCard } from '@/components/books/BookCard';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { formatDate, daysBetween } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { Borrowing } from '@/types';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  accent: string;
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <Card className="flex items-center gap-3">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', accent)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </Card>
  );
}

function dueBadge(daysLeft: number) {
  if (daysLeft < 0) return <Badge variant="danger">Overdue</Badge>;
  if (daysLeft <= 2) return <Badge variant="warning">Due in {daysLeft}d</Badge>;
  return <Badge variant="neutral">Due in {daysLeft}d</Badge>;
}

export function Dashboard() {
  const { currentUser } = useAuth();
  const lib = useLibrary();
  const navigate = useNavigate();

  const userId = currentUser?.id ?? '';
  const borrowings = lib.borrowingsByUser(userId);
  const reservations = lib.reservationsByUser(userId);
  const notifications = lib.notificationsByUser(userId);

  const activeBorrowings = useMemo(() => borrowings.filter((b) => b.status === 'active'), [borrowings]);
  const pendingBorrowings = useMemo(() => borrowings.filter((b) => b.status === 'pending'), [borrowings]);
  const activeReservations = useMemo(
    () => reservations.filter((r) => r.status === 'pending' || r.status === 'ready'),
    [reservations],
  );
  const unreadNotifications = useMemo(() => notifications.filter((n) => !n.read), [notifications]);

  const recentlyAdded = useMemo(
    () =>
      [...lib.books]
        .filter((b) => b.status === 'active')
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 4),
    [lib.books],
  );

  const recommended = useMemo(() => {
    const borrowedBookIds = new Set(borrowings.map((b) => b.bookId));
    const borrowedCategories = new Set(
      activeBorrowings.map((b) => lib.getBookById(b.bookId)?.category).filter((c): c is string => Boolean(c)),
    );
    const sameCategory = lib.books.filter(
      (b) => b.status === 'active' && !borrowedBookIds.has(b.id) && borrowedCategories.has(b.category),
    );
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);
    const fallback = lib.books.filter(
      (b) => b.status === 'active' && !borrowedBookIds.has(b.id) && !sameCategory.includes(b),
    );
    return [...sameCategory, ...fallback].slice(0, 4);
  }, [lib, borrowings, activeBorrowings]);

  const upcomingDue = useMemo(
    () => [...activeBorrowings].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [activeBorrowings],
  );

  const recentNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [notifications],
  );

  const publishedAnnouncements = useMemo(
    () =>
      lib.announcements
        .filter((a) => a.status === 'published')
        .sort(
          (a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime(),
        ),
    [lib.announcements],
  );

  const renderBorrowingRow = (borrowing: Borrowing) => {
    const book = lib.getBookById(borrowing.bookId);
    const daysLeft = daysBetween(new Date(), borrowing.dueDate);
    return (
      <li key={borrowing.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{book?.title ?? 'Unknown book'}</p>
          <p className={cn('text-xs', daysLeft <= 2 ? 'font-semibold text-red-600' : 'text-gray-500')}>
            Due {formatDate(borrowing.dueDate)}
          </p>
        </div>
        {dueBadge(daysLeft)}
      </li>
    );
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {currentUser.firstName}!</h1>
        <p className="mt-1 text-sm text-gray-500">Here&rsquo;s what&rsquo;s happening with your library account today.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={BookMarked} label="Active Books" value={activeBorrowings.length} accent="bg-primary-50 text-primary-600" />
        <StatCard icon={Clock} label="Pending Requests" value={pendingBorrowings.length} accent="bg-amber-50 text-amber-600" />
        <StatCard icon={CalendarClock} label="Reservations" value={activeReservations.length} accent="bg-blue-50 text-blue-600" />
        <StatCard icon={Bell} label="Notifications" value={unreadNotifications.length} accent="bg-red-50 text-red-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Borrowings</CardTitle>
            </CardHeader>
            {activeBorrowings.length === 0 ? (
              <EmptyState title="No active borrowings" description="Books you borrow will show up here." />
            ) : (
              <ul className="divide-y divide-gray-100">{activeBorrowings.map(renderBorrowingRow)}</ul>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Due Dates</CardTitle>
            </CardHeader>
            {upcomingDue.length === 0 ? (
              <EmptyState title="Nothing due soon" description="You have no upcoming due dates." />
            ) : (
              <ul className="divide-y divide-gray-100">{upcomingDue.map(renderBorrowingRow)}</ul>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently Added Books</CardTitle>
            </CardHeader>
            {recentlyAdded.length === 0 ? (
              <EmptyState title="No books yet" description="Newly catalogued books will appear here." />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {recentlyAdded.map((book) => (
                  <BookCard key={book.id} book={book} size="sm" />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended For You</CardTitle>
            </CardHeader>
            {recommended.length === 0 ? (
              <EmptyState title="No recommendations yet" description="Borrow a book to get personalized picks." />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {recommended.map((book) => (
                  <BookCard key={book.id} book={book} size="sm" />
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => navigate('/member/notifications')}
              >
                View all
              </Button>
            </CardHeader>
            {recentNotifications.length === 0 ? (
              <EmptyState title="No notifications" description="You're all caught up." />
            ) : (
              <div className="space-y-2">
                {recentNotifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Library Announcements</CardTitle>
            </CardHeader>
            {publishedAnnouncements.length === 0 ? (
              <EmptyState title="No announcements" description="Check back later for library news." />
            ) : (
              <ul className="space-y-3">
                {publishedAnnouncements.map((a) => (
                  <li key={a.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-start gap-2">
                      <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{a.content}</p>
                        <p className="mt-1 text-[11px] text-gray-400">{formatDate(a.publishedAt ?? a.createdAt)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
