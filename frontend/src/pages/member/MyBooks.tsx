import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { Badge, Button, Card, DataTable, type DataTableColumn } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';
import type { Borrowing, BorrowingStatus } from '@/types';

interface JoinedBorrowing extends Borrowing {
  bookTitle: string;
  bookAuthor: string;
}

type TabKey = 'active' | 'pending' | 'returned' | 'overdue' | 'rejected';

const TABS: { key: TabKey; label: string; status: BorrowingStatus }[] = [
  { key: 'active', label: 'Currently Borrowed', status: 'active' },
  { key: 'pending', label: 'Pending', status: 'pending' },
  { key: 'returned', label: 'Returned', status: 'returned' },
  { key: 'overdue', label: 'Overdue', status: 'overdue' },
  { key: 'rejected', label: 'Rejected', status: 'rejected' },
];

const STATUS_VARIANT: Record<BorrowingStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  active: 'info',
  pending: 'warning',
  returned: 'success',
  overdue: 'danger',
  rejected: 'neutral',
};

export function MyBooks() {
  const { currentUser } = useAuth();
  const lib = useLibrary();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const userId = currentUser?.id ?? '';
  const borrowings = lib.borrowingsByUser(userId);

  const joined: JoinedBorrowing[] = useMemo(
    () =>
      borrowings.map((b) => {
        const book = lib.getBookById(b.bookId);
        return { ...b, bookTitle: book?.title ?? 'Unknown book', bookAuthor: book?.author ?? '—' };
      }),
    [borrowings, lib],
  );

  const activeStatus = TABS.find((t) => t.key === activeTab)?.status ?? 'active';
  const rows = useMemo(
    () =>
      joined
        .filter((b) => b.status === activeStatus)
        .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime()),
    [joined, activeStatus],
  );

  const counts = useMemo(() => {
    const map: Record<TabKey, number> = { active: 0, pending: 0, returned: 0, overdue: 0, rejected: 0 };
    for (const b of joined) {
      const tab = TABS.find((t) => t.status === b.status);
      if (tab) map[tab.key] += 1;
    }
    return map;
  }, [joined]);

  const columns: DataTableColumn<JoinedBorrowing>[] = [
    {
      key: 'book',
      header: 'Book',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900">{row.bookTitle}</p>
          <p className="truncate text-xs text-gray-500">{row.bookAuthor}</p>
        </div>
      ),
    },
    {
      key: 'borrowedDate',
      header: 'Borrowed Date',
      render: (row) => (row.borrowedDate ? formatDate(row.borrowedDate) : '—'),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => formatDate(row.dueDate),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => navigate(`/member/catalog/${row.bookId}`)}>
          View Book
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">My Books</h1>

      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 p-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activeTab === tab.key ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-xs',
                  activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500',
                )}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="p-4 sm:p-5">
          <DataTable
            columns={columns}
            data={rows}
            keyField={(row) => row.id}
            emptyTitle={`No ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} books`}
            emptyDescription="There is nothing to show in this tab yet."
          />
        </div>
      </Card>
    </div>
  );
}
