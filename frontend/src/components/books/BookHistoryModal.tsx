import { useMemo } from 'react';
import type { Book, Borrowing, BorrowingStatus } from '@/types';
import { fullName } from '@/types';
import { Modal, Badge, DataTable, type DataTableColumn } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { formatDate } from '@/utils/date';

export interface BookHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

const STATUS_VARIANT: Record<BorrowingStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  pending: 'warning',
  active: 'info',
  returned: 'success',
  overdue: 'danger',
  rejected: 'neutral',
};

export function BookHistoryModal({ isOpen, onClose, book }: BookHistoryModalProps) {
  const { borrowings, getUserById } = useLibrary();

  const rows = useMemo(() => {
    if (!book) return [];
    return borrowings
      .filter((b) => b.bookId === book.id)
      .slice()
      .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
  }, [borrowings, book]);

  const columns: DataTableColumn<Borrowing>[] = [
    {
      key: 'borrower',
      header: 'Borrower',
      render: (row) => {
        const user = getUserById(row.userId);
        return <span className="font-medium text-gray-900">{user ? fullName(user) : 'Unknown member'}</span>;
      },
    },
    { key: 'requested', header: 'Requested', render: (row) => formatDate(row.requestedDate) },
    { key: 'borrowed', header: 'Borrowed', render: (row) => (row.borrowedDate ? formatDate(row.borrowedDate) : '—') },
    { key: 'due', header: 'Due', render: (row) => formatDate(row.dueDate) },
    { key: 'returned', header: 'Returned', render: (row) => (row.returnedDate ? formatDate(row.returnedDate) : '—') },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book ? `Borrowing History — ${book.title}` : 'Borrowing History'}
      description={book ? `Accession No. ${book.accessionNumber}` : undefined}
      size="lg"
    >
      <DataTable
        columns={columns}
        data={rows}
        keyField={(row) => row.id}
        emptyTitle="No borrowing history"
        emptyDescription="This book has not been borrowed yet."
      />
    </Modal>
  );
}
