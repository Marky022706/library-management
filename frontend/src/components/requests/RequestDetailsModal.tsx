import type { BorrowRequest } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDate, MOCK_TODAY } from '../../utils/date';
import { userDisplayName } from '../../data/users';

interface RequestDetailsModalProps {
  request: BorrowRequest | null;
  onClose: () => void;
  onMarkReturned: (request: BorrowRequest) => void;
}

export function RequestDetailsModal({ request, onClose, onMarkReturned }: RequestDetailsModalProps) {
  if (!request) return null;

  const isActiveLoan = request.type === 'borrowing' && request.status === 'approved' && !request.returnedAt;
  const isOverdue = isActiveLoan && Boolean(request.dueDate) && request.dueDate! < MOCK_TODAY;

  return (
    <Modal
      open={Boolean(request)}
      onClose={onClose}
      title={`Request ${request.id}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {isActiveLoan && <Button onClick={() => onMarkReturned(request)}>Mark as Returned</Button>}
        </>
      }
    >
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted">Type</dt>
          <dd className="mt-1 capitalize text-ink">{request.type}</dd>
        </div>
        <div>
          <dt className="text-muted">Status</dt>
          <dd className="mt-1">
            <Badge tone={request.status === 'approved' ? 'green' : request.status === 'pending' ? 'amber' : 'red'} dot>
              {request.status}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-muted">Requester</dt>
          <dd className="mt-1 text-ink">{userDisplayName(request.requesterId)}</dd>
        </div>
        <div>
          <dt className="text-muted">Date Requested</dt>
          <dd className="mt-1 text-ink">{formatDate(request.date)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted">Book / Note</dt>
          <dd className="mt-1 text-ink">{request.note}</dd>
        </div>
        <div>
          <dt className="text-muted">Approver</dt>
          <dd className="mt-1 text-ink">{request.approverId ? userDisplayName(request.approverId) : '-'}</dd>
        </div>
        {request.resolvedDate && (
          <div>
            <dt className="text-muted">Resolved</dt>
            <dd className="mt-1 text-ink">{formatDate(request.resolvedDate)}</dd>
          </div>
        )}
        {request.dueDate && (
          <div>
            <dt className="text-muted">Due Date</dt>
            <dd className="mt-1 text-ink">
              {formatDate(request.dueDate)} {isOverdue && <Badge tone="red">overdue</Badge>}
            </dd>
          </div>
        )}
        {request.returnedAt && (
          <div>
            <dt className="text-muted">Returned</dt>
            <dd className="mt-1 text-ink">{formatDate(request.returnedAt)}</dd>
          </div>
        )}
      </dl>
    </Modal>
  );
}
