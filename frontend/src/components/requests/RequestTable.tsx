import { Check, ClipboardList, Eye, X } from 'lucide-react';
import type { BorrowRequest } from '../../types';
import { Badge, type BadgeTone } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { formatDate } from '../../utils/date';
import { userDisplayName } from '../../data/users';

interface RequestTableProps {
  requests: BorrowRequest[];
  onView: (request: BorrowRequest) => void;
  onApprove: (request: BorrowRequest) => void;
  onReject: (request: BorrowRequest) => void;
}

const TYPE_TONE: Record<BorrowRequest['type'], BadgeTone> = {
  borrowing: 'blue',
  acquisition: 'purple',
  archive: 'neutral',
};

const STATUS_TONE: Record<BorrowRequest['status'], BadgeTone> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
};

export function RequestTable({ requests, onView, onApprove, onReject }: RequestTableProps) {
  if (requests.length === 0) {
    return <EmptyState icon={ClipboardList} title="No requests found" description="Nothing to show in this tab yet." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="py-3 pr-4">Request ID</th>
            <th className="py-3 pr-4">Type</th>
            <th className="py-3 pr-4">Requester</th>
            <th className="py-3 pr-4">Book / Note</th>
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Approver</th>
            <th className="py-3 pr-0 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
              <td className="py-3 pr-4 font-medium text-ink">{request.id}</td>
              <td className="py-3 pr-4">
                <Badge tone={TYPE_TONE[request.type]}>{request.type}</Badge>
              </td>
              <td className="py-3 pr-4 text-ink">{userDisplayName(request.requesterId)}</td>
              <td className="py-3 pr-4 max-w-[220px] truncate text-muted" title={request.note}>
                {request.note}
              </td>
              <td className="py-3 pr-4 text-muted">{formatDate(request.date)}</td>
              <td className="py-3 pr-4">
                <Badge tone={STATUS_TONE[request.status]} dot>
                  {request.status}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-muted">{request.approverId ? userDisplayName(request.approverId) : '-'}</td>
              <td className="py-3 pr-0">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView(request)}
                    title="View request"
                    aria-label={`View ${request.id}`}
                    className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {request.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove(request)}
                        title="Approve request"
                        aria-label={`Approve ${request.id}`}
                        className="rounded-lg p-2 text-primary-700 hover:bg-primary-50"
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(request)}
                        title="Reject request"
                        aria-label={`Reject ${request.id}`}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
