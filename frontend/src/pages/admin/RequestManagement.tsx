import { useMemo, useState } from 'react';
import { Card } from '../../components/common/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RequestTable } from '../../components/requests/RequestTable';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';
import type { BorrowRequest, RequestType } from '../../types';

type TabKey = 'all' | RequestType;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'borrowing', label: 'Borrowing' },
  { key: 'archive', label: 'Archive' },
  { key: 'acquisition', label: 'Acquisition' },
];

export function RequestManagement() {
  const { requests, approveRequest, rejectRequest, returnLoan } = useLibraryData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [viewingRequest, setViewingRequest] = useState<BorrowRequest | null>(null);
  const [pendingAction, setPendingAction] = useState<{ request: BorrowRequest; action: 'approve' | 'reject' } | null>(null);

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = { all: requests.length, borrowing: 0, archive: 0, acquisition: 0 };
    for (const r of requests) counts[r.type] += 1;
    return counts;
  }, [requests]);

  const visibleRequests = useMemo(
    () => (activeTab === 'all' ? requests : requests.filter((r) => r.type === activeTab)),
    [requests, activeTab],
  );

  const confirmPendingAction = () => {
    if (!pendingAction || !currentUser) return;
    const { request, action } = pendingAction;
    if (action === 'approve') {
      approveRequest(request.id, currentUser.id);
      showToast(`${request.type === 'borrowing' ? 'Borrowing' : 'Request'} ${request.id} approved.`);
    } else {
      rejectRequest(request.id, currentUser.id);
      showToast(`Request ${request.id} rejected.`);
    }
    setPendingAction(null);
  };

  const handleMarkReturned = (request: BorrowRequest) => {
    returnLoan(request.id);
    showToast(`"${request.note}" marked as returned.`);
    setViewingRequest(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">Request Management</h1>

      <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.key ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-xs',
                activeTab === tab.key ? 'bg-primary-100 text-primary-800' : 'bg-gray-200 text-muted',
              )}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <RequestTable
          requests={visibleRequests}
          onView={setViewingRequest}
          onApprove={(request) => setPendingAction({ request, action: 'approve' })}
          onReject={(request) => setPendingAction({ request, action: 'reject' })}
        />
      </Card>

      <RequestDetailsModal request={viewingRequest} onClose={() => setViewingRequest(null)} onMarkReturned={handleMarkReturned} />

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.action === 'approve' ? 'Approve request?' : 'Reject request?'}
        message={`${pendingAction?.request.id} — "${pendingAction?.request.note}"`}
        confirmLabel={pendingAction?.action === 'approve' ? 'Approve' : 'Reject'}
        danger={pendingAction?.action === 'reject'}
        onConfirm={confirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
