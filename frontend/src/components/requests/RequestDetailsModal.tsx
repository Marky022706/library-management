import type { BorrowingStatus, LibraryRequest, RequestStatus, RequestType } from '@/types';
import { fullName } from '@/types';
import { Modal, Badge } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { formatDate } from '@/utils/date';

export interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LibraryRequest | null;
}

const TYPE_VARIANT: Record<RequestType, 'info' | 'neutral' | 'primary'> = {
  Borrowing: 'info',
  Archive: 'neutral',
  Acquisition: 'primary',
};

const STATUS_VARIANT: Record<RequestStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const BORROWING_STATUS_VARIANT: Record<BorrowingStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  pending: 'warning',
  active: 'info',
  returned: 'success',
  overdue: 'danger',
  rejected: 'neutral',
};

export function RequestDetailsModal({ isOpen, onClose, request }: RequestDetailsModalProps) {
  const { getUserById, getBookById, borrowings } = useLibrary();

  const requester = request ? getUserById(request.requesterId) : undefined;
  const approver = request?.approverId ? getUserById(request.approverId) : undefined;
  const book = request?.bookId ? getBookById(request.bookId) : undefined;
  const borrowing = request?.borrowingId ? borrowings.find((b) => b.id === request.borrowingId) : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Details" size="md">
      {request && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={TYPE_VARIANT[request.type]}>{request.type}</Badge>
            <Badge variant={STATUS_VARIANT[request.status]} className="capitalize">
              {request.status}
            </Badge>
            <span className="font-mono text-xs text-gray-400">{request.id}</span>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Requester</p>
              <p className="text-sm text-gray-900">{requester ? fullName(requester) : 'Unknown'}</p>
              {requester && <p className="text-xs text-gray-500">{requester.email}</p>}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Date Requested</p>
              <p className="text-sm text-gray-900">{formatDate(request.date)}</p>
            </div>
            {(book || request.bookTitle) && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Book</p>
                <p className="text-sm text-gray-900">{book?.title ?? request.bookTitle}</p>
                {book && <p className="text-xs text-gray-500">{book.category} · Accession No. {book.accessionNumber}</p>}
              </div>
            )}
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Details</p>
              <p className="text-sm text-gray-700">{request.details}</p>
            </div>
            {request.status !== 'pending' && (
              <>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Approver</p>
                  <p className="text-sm text-gray-900">{approver ? fullName(approver) : '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Resolved Date</p>
                  <p className="text-sm text-gray-900">{request.resolvedDate ? formatDate(request.resolvedDate) : '—'}</p>
                </div>
              </>
            )}
          </div>

          {borrowing && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Linked Borrowing</p>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <Badge variant={BORROWING_STATUS_VARIANT[borrowing.status]} className="capitalize">
                    {borrowing.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="text-gray-900">{formatDate(borrowing.dueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Borrowed</p>
                  <p className="text-gray-900">{borrowing.borrowedDate ? formatDate(borrowing.borrowedDate) : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Returned</p>
                  <p className="text-gray-900">{borrowing.returnedDate ? formatDate(borrowing.returnedDate) : '—'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
