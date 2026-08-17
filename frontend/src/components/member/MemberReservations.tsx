import { Bookmark, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export interface MemberReservationItem {
  id: string;
  bookTitle: string;
  author: string;
  reservedDate: string;
  status: 'pending' | 'ready_for_pickup' | 'completed' | 'cancelled';
  pickupDeadline?: string;
}

interface MemberReservationsProps {
  reservations: MemberReservationItem[];
  onViewAll?: () => void;
}

export function MemberReservations({ reservations, onViewAll }: MemberReservationsProps) {
  const STATUS_CONFIG = {
    pending: { label: 'In Queue', tone: 'amber' as const, icon: Clock },
    ready_for_pickup: { label: 'Ready for Pickup', tone: 'green' as const, icon: CheckCircle2 },
    completed: { label: 'Fulfilled', tone: 'blue' as const, icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', tone: 'neutral' as const, icon: Clock },
  };

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-8 text-center">
        <Bookmark className="h-6 w-6 text-slate-400 mb-1" />
        <p className="text-xs font-semibold text-slate-700">No active book reservations</p>
        <p className="text-[11px] text-slate-400">Books that are currently checked out can be reserved.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reservations.map((res) => {
        const config = STATUS_CONFIG[res.status] || STATUS_CONFIG.pending;
        const Icon = config.icon;

        return (
          <div
            key={res.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:bg-slate-100/70"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-2xs text-blue-600">
                <Bookmark className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900">{res.bookTitle}</p>
                <p className="truncate text-[11px] text-slate-500">{res.author}</p>
                {res.pickupDeadline && res.status === 'ready_for_pickup' && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Pickup by: {res.pickupDeadline}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge tone={config.tone} className="text-[10px] flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {config.label}
              </Badge>
              <span className="text-[10px] text-slate-400">Reserved {res.reservedDate}</span>
            </div>
          </div>
        );
      })}

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-2xs"
        >
          <span>View All Reservations</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
