import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import type { LibraryRequest, RequestStatus, RequestType } from '@/types';
import { fullName } from '@/types';
import { Button, Badge, Card, ConfirmDialog, DataTable, Pagination, type DataTableColumn } from '@/components/ui';
import { RequestDetailsModal } from '@/components/requests/RequestDetailsModal';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';

const TABS: { label: string; value: RequestType | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Borrowing', value: 'Borrowing' },
  { label: 'Archive', value: 'Archive' },
  { label: 'Acquisition', value: 'Acquisition' },
];

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

type DecisionAction = 'approve' | 'reject';

interface DecisionTarget {
  request: LibraryRequest;
  action: DecisionAction;
}

export function Requests() {
  const lib = useLibrary();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<RequestType | 'All'>('All');

  const detailsModal = useDisclosure();
  const [viewedRequest, setViewedRequest] = useState<LibraryRequest | null>(null);

  const [decisionTarget, setDecisionTarget] = useState<DecisionTarget | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const filteredRequests = useMemo(() => {
    const rows = activeTab === 'All' ? lib.requests : lib.requests.filter((r) => r.type === activeTab);
    return rows.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [lib.requests, activeTab]);

  const { page, totalPages, pageItems, setPage } = usePagination(filteredRequests, 8);

  if (!currentUser) return null;

  async function handleConfirmDecision() {
    if (!decisionTarget) return;
    setIsResolving(true);
    try {
      if (decisionTarget.action === 'approve') {
        await lib.approveRequest(decisionTarget.request.id, currentUser!.id);
        toast.success('Request approved.');
      } else {
        await lib.rejectRequest(decisionTarget.request.id, currentUser!.id);
        toast.success('Request rejected.');
      }
      setDecisionTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsResolving(false);
    }
  }

  const columns: DataTableColumn<LibraryRequest>[] = [
    { key: 'id', header: 'Request ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (r) => <Badge variant={TYPE_VARIANT[r.type]}>{r.type}</Badge>,
    },
    {
      key: 'requester',
      header: 'Requester',
      render: (r) => {
        const user = lib.getUserById(r.requesterId);
        return user ? fullName(user) : 'Unknown';
      },
    },
    { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={STATUS_VARIANT[r.status]} className="capitalize">
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'approver',
      header: 'Approver',
      render: (r) => {
        if (!r.approverId) return '—';
        const approver = lib.getUserById(r.approverId);
        return approver ? fullName(approver) : 'Unknown';
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="!px-2"
            aria-label={`View request ${r.id}`}
            title="View details"
            onClick={() => {
              setViewedRequest(r);
              detailsModal.open();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {r.status === 'pending' && (
            <>
              <Button variant="success" size="sm" onClick={() => setDecisionTarget({ request: r, action: 'approve' })}>
                Approve
              </Button>
              <Button variant="danger" size="sm" onClick={() => setDecisionTarget({ request: r, action: 'reject' })}>
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Request Management</h1>
        <p className="mt-1 text-sm text-gray-500">Review borrowing, archive, and acquisition requests.</p>
      </div>

      <Card>
        <div className="inline-flex w-fit flex-wrap rounded-lg border border-gray-200 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab.value ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-4">
          <DataTable
            columns={columns}
            data={pageItems}
            keyField={(r) => r.id}
            emptyTitle="No requests found"
            emptyDescription="There are no requests in this category yet."
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
        </div>
      </Card>

      <RequestDetailsModal isOpen={detailsModal.isOpen} onClose={detailsModal.close} request={viewedRequest} />

      <ConfirmDialog
        isOpen={decisionTarget !== null}
        title={decisionTarget?.action === 'approve' ? 'Approve this request?' : 'Reject this request?'}
        message={
          decisionTarget
            ? `This will ${decisionTarget.action === 'approve' ? 'approve' : 'reject'} the ${decisionTarget.request.type.toLowerCase()} request${decisionTarget.request.bookTitle ? ` for "${decisionTarget.request.bookTitle}"` : ''}.`
            : ''
        }
        confirmLabel={decisionTarget?.action === 'approve' ? 'Approve' : 'Reject'}
        variant={decisionTarget?.action === 'reject' ? 'danger' : 'default'}
        isLoading={isResolving}
        onConfirm={handleConfirmDecision}
        onCancel={() => setDecisionTarget(null)}
      />
    </div>
  );
}
