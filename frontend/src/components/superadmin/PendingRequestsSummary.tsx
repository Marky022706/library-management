import { ArrowRight, BookOpen, Archive, ShoppingBag } from 'lucide-react';
import { Badge } from '../common/Badge';

interface PendingRequestsSummaryProps {
  onViewAllRequests?: () => void;
}

export function PendingRequestsSummary({ onViewAllRequests }: PendingRequestsSummaryProps) {
  const requestTypes = [
    {
      title: 'Borrowing Requests',
      count: 12,
      description: 'Book checkout requests from active members',
      tone: 'blue' as const,
      icon: BookOpen,
    },
    {
      title: 'Archive Requests',
      count: 4,
      description: 'Super Admin approval required to retire damaged copies',
      tone: 'amber' as const,
      icon: Archive,
    },
    {
      title: 'Acquisition Requests',
      count: 7,
      description: 'Recommended titles submitted for library purchase',
      tone: 'purple' as const,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {requestTypes.map((req, idx) => {
          const Icon = req.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:bg-slate-100/70"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">{req.title}</p>
                  <p className="truncate text-[11px] text-slate-500">{req.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{req.count}</span>
                <Badge tone={req.tone} className="text-[10px]">
                  Pending
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {onViewAllRequests && (
        <button
          onClick={onViewAllRequests}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-2xs"
        >
          <span>View All Request Management</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
