import { CalendarCheck, Clock, ArrowRight } from 'lucide-react';

interface AttendanceSummaryCardProps {
  lastVisit?: string;
  monthlyVisits?: number;
  onViewHistory?: () => void;
}

export function AttendanceSummaryCard({
  lastVisit = 'August 15, 2026 — 2:34 PM',
  monthlyVisits = 12,
  onViewHistory,
}: AttendanceSummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">My Library Attendance</p>
            <p className="text-[11px] text-slate-500">Scan QR at library kiosk</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-indigo-600">{monthlyVisits}</span>
          <p className="text-[10px] text-slate-400">Visits this month</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">
        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span className="truncate">Last Visit: <strong>{lastVisit}</strong></span>
      </div>

      {onViewHistory && (
        <button
          onClick={onViewHistory}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-700 transition-colors shadow-2xs"
        >
          <span>View Attendance Log</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
